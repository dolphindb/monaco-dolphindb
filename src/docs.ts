import { keywords, constants } from 'dolphindb/language.js';

import type * as Monaco from 'monaco-editor';
import { LANGUAGE_ID } from './constant.js';
import type { RegisterDolphinDBLanguageOptions } from './index.js';

const constants_lower = constants.map((constant) => constant.toLowerCase());

export interface IDocsItem {
  title: string;
  type: 'command' | 'function' | 'template';
  children: IDocItemContent[];
}

export interface IDocItemContent {
  title: string;
  type?: 'detail' | 'example' | 'grammer' | 'parameters';
  children: DocItemContentChild[];
}

export type DocItemContentChild =
  | {
      type: 'code';
      value: string[];
      language?: string;
    }
  | {
      type: 'text';
      value: string[];
      language?: string;
    };

export type IDocs = Record<string, IDocsItem>;
export type DocsAvailableValue = string | IDocs | Promise<IDocs> | (() => IDocs | Promise<IDocs>);

let docs: IDocs = {};

let funcs: string[] = [];
let funcs_lower: string[] = [];

/** 最大搜索行数 */
const MAX_MATCH_LINES = 30;

// 栈 token 匹配表
const PAIR_TOKEN_MAP: Record<string, string> = {
  ')': '(',
  '}': '{',
  ']': '[',
};

const PAIR_END_TOKENS = new Set(Object.values(PAIR_TOKEN_MAP));

const FUNC_FPS = {
  command: 'FunctionsandCommands/CommandsReferences/',
  function: 'FunctionsandCommands/FunctionReferences/',
  template: 'Functionalprogramming/TemplateFunctions/',
} as const;

function getFunctionMonacoMarkdownString(keyword: string, language: RegisterDolphinDBLanguageOptions['language']) {
  const func_doc = docs[keyword] || docs[keyword + '!'];

  if (!func_doc) return;

  const { title, type } = func_doc;

  let str =
    // 标题
    `#### ${title}\n` +
    // 链接
    'https://' +
    (language === 'zh' ? 'docs.dolphindb.cn/zh/' : 'dolphindb.com/') +
    'help/' +
    FUNC_FPS[type] +
    (type !== 'template' ? `${title[0]}/` : '') +
    title +
    '.html\n';

  for (const para of func_doc.children) {
    // 加入段
    str += `#### ${para.title}\n`;

    for (const x of para.children)
      if (x.type === 'text' && para.type !== 'example')
        // 对于参数段落，以 markdown 插入
        str += x.value.join('\n') + '\n';
      // x.type === 'code' || para.type === 'example'
      else
        str +=
          '```' +
          (x.language?.trim() === 'console' ? 'dolphindb' : x.language || '') +
          '\n' +
          x.value.join('\n') +
          '\n' +
          '```\n';

    str += '\n';
  }

  return {
    isTrusted: true,
    value: str,
  } as Monaco.IMarkdownString;
}

/** 利用当前光标找出函数参数开始位置及函数名, 若找不到返回 -1 */
function find_func_start(
  document: Monaco.editor.ITextModel,
  position: Monaco.Position
): {
  func_name: string;
  param_search_pos: number;
} {
  const func_name_regex = /[a-z|A-Z|0-9|!|_]/;

  const text = document.getValueInRange({
    startLineNumber: Math.max(position.lineNumber - MAX_MATCH_LINES, 0),
    startColumn: 0,
    endLineNumber: position.lineNumber,
    endColumn: position.column,
  });

  let stack_depth = 0;
  let param_search_pos = -1;
  for (let i = text.length; i >= 0; i--) {
    const char = text[i];
    // 遇到右括号，入栈，增加一层括号语境深度
    if (char === ')') {
      stack_depth++;
      continue;
    }
    // 遇到左括号，出栈，退出一层括号语境深度
    else if (char === '(') {
      stack_depth--;
      continue;
    }

    // 栈深度小于0，且遇到合法函数名字符，跳出括号语境，搜索结束：参数搜索开始位置
    if (func_name_regex.test(char) && stack_depth < 0) {
      param_search_pos = i;
      break;
    }
  }

  // 找不到参数搜索开始位置，返回null
  if (param_search_pos === -1) return { param_search_pos: -1, func_name: '' };

  // 往前找函数名
  let func_name_end = -1;
  let func_name_start = 0;
  for (let i = param_search_pos; i >= 0; i--) {
    const char = text[i];

    // 空字符跳过
    if (func_name_end === -1 && char === ' ') continue;

    // 合法函数名字字符，继续往前找
    if (func_name_regex.test(char)) {
      // 标记函数名字末尾位置
      if (func_name_end === -1) func_name_end = i;

      continue;
    }

    // 不合法函数名字符，标记函数名字开头位置
    func_name_start = i + 1;
    break;
  }

  // 找不到函数名
  if (func_name_end === -1) return { param_search_pos: -1, func_name: '' };

  return {
    param_search_pos: param_search_pos + 1,
    func_name: text.slice(func_name_start, func_name_end + 1),
  };
}

/** 根据函数参数开始位置分析参数语义，提取出当前参数索引 */
function find_active_param_index(document: Monaco.editor.ITextModel, position: Monaco.Position, start: number) {
  const text = document.getValueInRange({
    startLineNumber: Math.max(position.lineNumber - MAX_MATCH_LINES, 0),
    startColumn: 0,
    endLineNumber: position.lineNumber,
    endColumn: position.column,
  });

  let index = 0;
  const stack = [];

  // 分隔符，此处为逗号
  const seperator = ',';

  let ncommas = 0;

  // 搜索
  for (let i = start; i < text.length; i++) {
    const char = text[i];

    // 空字符跳过
    if (/\s/.test(char)) continue;

    // 字符串内除引号全部忽略
    if (stack[stack.length - 1] === '"' || stack[stack.length - 1] === "'") {
      // 遇到相同引号，出栈
      if ((stack[stack.length - 1] === '"' && char === '"') || (stack[stack.length - 1] === "'" && char === "'"))
        stack.pop();
      continue;
    }

    // 开括号入栈
    if (PAIR_END_TOKENS.has(char) || char === '"' || char === "'") {
      stack.push(char);
      continue;
    } else if (char in PAIR_TOKEN_MAP)
      if (stack[stack.length - 1] === PAIR_TOKEN_MAP[char]) {
        // 括号匹配，出栈，括号不匹配，返回null
        stack.pop();
        continue;
      } // 括号不匹配，返回-1
      else return -1;

    // 栈深度为1 且为左小括号：当前语境
    if (stack.length === 1 && stack[0] === '(')
      if (char === seperator)
        // 遇到逗号，若之前有合法参数，计入逗号
        ncommas++;

    // 根据逗号数量判断高亮参数索引值
    index = ncommas;
  }

  const func_start_text = text.slice(0, start);
  /** 匹配当前函数名的正则, 并捕获该函数名 */
  const match = /[a-zA-Z_\u4e00-\u9fa5][\w\u4e00-\u9fa5]*!?$/.exec(func_start_text);
  return match && func_start_text[start - 1 /* 去掉括号 */ - match[0].length] === '.' ? index + 1 : index;
}

/** 根据函数名提取出相应的文件对象，提取出函数 signature 和参数 */
function get_signature_and_params(func_name: string): {
  signature: string;
  params: string[];
} | null {
  const para = docs[func_name]?.children.filter((para) => para.type === 'grammer')[0];
  if (!para) return null;

  // 找出语法内容块的第一个非空行
  const funcLine = para.children[0].value.filter((line) => line.trim() !== '')[0].trim();
  const matched = funcLine.match(/[a-zA-z0-9!]+\((.*)\)/);
  if (!matched) return null;

  const signature = matched[0];
  const params = matched[1].split(',').map((s) => s.trim());
  return { signature, params };
}

export async function loadDocs(docsValue: DocsAvailableValue) {
  switch (typeof docsValue) {
    case 'string':
      docs = await fetch(docsValue).then((res) => res.json());
      break;
    case 'function':
      docs = await docsValue();
      break;
    case 'object':
      docs = await docsValue;
      break;
    default:
      docs = {};
      break;
  }

  funcs = Object.keys(docs);
  funcs_lower = funcs.map((func) => func.toLowerCase());
}

export function registerDocsRelatedLanguageProviders(
  monaco: typeof Monaco,
  language: RegisterDolphinDBLanguageOptions['language']
) {
  const { languages } = monaco;
  const { CompletionItemKind } = languages;

  languages.registerCompletionItemProvider(LANGUAGE_ID, {
    provideCompletionItems(doc, pos, ctx, canceller) {
      if (canceller.isCancellationRequested) return;

      const keyword = doc.getWordAtPosition(pos)?.word ?? '';

      let fns: string[];
      let _constants: string[];

      if (keyword.length === 1) {
        const c = keyword[0].toLowerCase();
        fns = funcs.filter((func, i) => funcs_lower[i].startsWith(c));
        _constants = constants.filter((constant, i) => constants_lower[i].startsWith(c));
      } else {
        const keyword_lower = keyword.toLowerCase();

        fns = funcs.filter((func, i) => {
          const func_lower = funcs_lower[i];
          let j = 0;
          for (const c of keyword_lower) {
            j = func_lower.indexOf(c, j) + 1;
            if (!j)
              // 找不到则 j === 0
              return false;
          }

          return true;
        });

        _constants = constants.filter((constant, i) => {
          const constant_lower = constants_lower[i];
          let j = 0;
          for (const c of keyword_lower) {
            j = constant_lower.indexOf(c, j) + 1;
            if (!j)
              // 找不到则 j === 0
              return false;
          }

          return true;
        });
      }

      return {
        suggestions: [
          ...keywords
            .filter((kw) => kw.startsWith(keyword))
            .map(
              (kw) =>
                ({
                  label: kw,
                  insertText: kw,
                  kind: CompletionItemKind.Keyword,
                }) as Monaco.languages.CompletionItem
            ),
          ..._constants.map(
            (constant) =>
              ({
                label: constant,
                insertText: constant,
                kind: CompletionItemKind.Constant,
              }) as Monaco.languages.CompletionItem
          ),
          ...fns.map(
            (fn) =>
              ({
                label: fn,
                insertText: fn,
                kind: CompletionItemKind.Function,
              }) as Monaco.languages.CompletionItem
          ),
        ],
      };
    },

    resolveCompletionItem(item, _canceller) {
      item.documentation = getFunctionMonacoMarkdownString(item.label as string, language);
      return item;
    },
  });

  languages.registerHoverProvider(LANGUAGE_ID, {
    provideHover(doc, pos, _canceller) {
      const word = doc.getWordAtPosition(pos);

      if (!word) return;

      const md = getFunctionMonacoMarkdownString(word.word, language);

      if (!md) return;

      return {
        contents: [md],
      };
    },
  });

  languages.registerSignatureHelpProvider(LANGUAGE_ID, {
    signatureHelpTriggerCharacters: ['(', ','],

    provideSignatureHelp(doc, pos, canceller, _ctx) {
      if (canceller.isCancellationRequested) return;

      const { func_name, param_search_pos } = find_func_start(doc, pos);
      if (param_search_pos === -1) return;

      const index = find_active_param_index(doc, pos, param_search_pos);
      if (index === -1) return;

      const signature_and_params = get_signature_and_params(func_name);
      if (!signature_and_params) return;

      const { signature, params } = signature_and_params;

      return {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        dispose() {},

        value: {
          activeParameter: index > params.length - 1 ? params.length - 1 : index,
          signatures: [
            {
              label: signature,
              documentation: getFunctionMonacoMarkdownString(func_name, language),
              parameters: params.map((param) => ({
                label: param,
              })),
            },
          ],
          activeSignature: 0,
        },
      };
    },
  });
}
