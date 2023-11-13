import { DocsAnalyser } from './analyser.js';

const FUNC_NAME_CHAR_REG_EXP = /[a-zA-Z0-9!_]/;

function reverseSearchFunc(text: string): null | {
  paramStartAt: number;
  funcName: string;
} {
  let depth = 0;
  let paramStartAt = -1;

  for (let i = text.length; i >= 0; i--) {
    const char = text[i];

    // 遇到右括号，入栈
    if (char === ')') {
      depth++;
      continue;
    }
    // 遇到左括号，出栈
    else if (char === '(') {
      depth--;
      continue;
    }

    // 栈深度小于0，且遇到合法函数名字符，跳出括号语境，搜索结束：参数搜索开始位置
    if (FUNC_NAME_CHAR_REG_EXP.test(char) && depth < 0) {
      paramStartAt = i;
      break;
    }
  }

  // 找不到参数搜索开始位置，返回null
  if (paramStartAt === -1) {
    return null;
  }

  // 往前找函数名
  let func_name_end = -1;
  let func_name_start = 0;
  for (let i = paramStartAt; i >= 0; i--) {
    const char = text[i];

    // 空字符跳过
    if (func_name_end === -1 && char === ' ') continue;

    // 合法函数名字字符，继续往前找
    if (FUNC_NAME_CHAR_REG_EXP.test(char)) {
      // 标记函数名字末尾位置
      if (func_name_end === -1) func_name_end = i;

      continue;
    }

    // 不合法函数名字符，标记函数名字开头位置
    func_name_start = i + 1;
    break;
  }

  // 找不到函数名
  if (func_name_end === -1) {
    return null;
  }

  return {
    paramStartAt: paramStartAt + 1,
    funcName: text.slice(func_name_start, func_name_end + 1),
  };
}

// 参数分隔符，此处为逗号
const PARAM_SEPARATOR = ',';

// 栈 token 匹配表
const PAIR_TOKEN_MAP: Record<string, string> = {
  ')': '(',
  '}': '{',
  ']': '[',
};

const PAIR_START_TOKENS = new Set(Object.values(PAIR_TOKEN_MAP));

const LAST_IDENTIFIER_NAME_REGEXP = /[a-zA-Z_\u4e00-\u9fa5][\w\u4e00-\u9fa5]*!?$/;

/** 根据函数参数开始位置分析参数语义，提取出当前参数索引 */
function findActiveParamIndex(text: string, paramStartAt: number) {
  let index = 0;
  const stack = [];

  let commasCount = 0;

  // 是否在转义符作用范围内
  let isEscapingString = false;

  // 搜索
  for (let i = paramStartAt; i < text.length; i++) {
    const char = text[i];

    // 空字符跳过
    if (/\s/.test(char)) continue;

    // 转义符作用范围下一个字符直接忽略
    if (isEscapingString) {
      isEscapingString = false;
      continue;
    }

    const lastStack = stack[stack.length - 1];
    // 字符串内除引号全部忽略
    if (lastStack === '"' || lastStack === "'") {
      // 进入转义符作用范围
      if (char === '\\') {
        isEscapingString = true;
        continue;
      }

      // 遇到相同引号
      if (char === lastStack) {
        stack.pop();
      }

      continue;
    }

    // 开括号入栈
    if (PAIR_START_TOKENS.has(char) || char === '"' || char === "'") {
      stack.push(char);
      continue;
    } else if (char in PAIR_TOKEN_MAP) {
      if (lastStack === PAIR_TOKEN_MAP[char]) {
        // 括号匹配，出栈
        stack.pop();
        continue;
      } else {
        // 括号不匹配，出现语法错误，直接退出
        return -1;
      }
    }

    // 栈深度为1 且为左小括号：当前语境
    if (stack.length === 1 && stack[0] === '(') {
      if (char === PARAM_SEPARATOR) {
        // 遇到逗号，若之前有合法参数，计入逗号
        commasCount++;
      }
    }

    // 根据逗号数量判断高亮参数索引值
    index = commasCount;
  }

  const caller = text.slice(0, paramStartAt);
  /** 匹配当前函数名的正则, 并捕获该函数名 */
  const match = LAST_IDENTIFIER_NAME_REGEXP.exec(caller);

  const isMemberCall = match && caller[paramStartAt - 1 /* 去掉括号 */ - match[0].length] === '.';

  // 是否为对象方法调用，若是，参数索引+1（对象会变成第一个参数）
  return isMemberCall ? index + 1 : index;
}

export function parseSignatureHelpFromText(text: string, docsAnalyser: DocsAnalyser) {
  const caller = reverseSearchFunc(text);
  if (!caller) {
    return;
  }

  const { funcName, paramStartAt } = caller;

  const cursorParamIndex = findActiveParamIndex(text, paramStartAt);
  if (cursorParamIndex === -1) {
    return;
  }

  const signatures = docsAnalyser.getSignatures(funcName);
  if (!signatures) {
    return;
  }

  const signature = signatures[0];
  const paramsLength = signature.parameters.length;
  // 如果输入参数数量超出了签名内声明的参数数量，activeParameter 为 undefined
  const activeParameter = cursorParamIndex > paramsLength - 1 ? undefined : cursorParamIndex;
  const documentationMD = docsAnalyser.getFunctionMarkdown(funcName);

  return {
    signature,
    activeParameter,
    documentationMD,
  };
}
