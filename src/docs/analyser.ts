import { keywords, constants } from 'dolphindb/language.js';

export interface FunctionSignature {
  fullText: string;
  name: string;
  parameters: Array<{
    fullText: string;
    name: string;
    optional?: boolean;
    defaultValue?: string;
  }>;
}

export interface FunctionItem {
  /** 文档的公网链接 */
  href: string;
  /** 部分函数存在多个签名，例如 append! 和 x.append!, eachPre 和 func:P 这两组，最好在分析阶段就处理好 */
  signatures: FunctionSignature[] | null;
  /** 文档内容 */
  markdown: string;
}

type Docs = Record<string, FunctionItem>;

function isCompletionMatch(target: string, search: string) {
  let j = 0;
  for (const c of search) {
    j = target.indexOf(c, j) + 1;
    if (!j) {
      // 找不到则 j === 0
      return false;
    }
  }

  return true;
}

export class DocsAnalyser {
  /** 文档原始信息 */
  docs?: Docs;

  /** 函数名列表 */
  funcs: string[] = [];

  /** 转化成小写字母的函数名列表 */
  lowerFuncs: string[] = [];

  updateDocs(docs: Docs) {
    this.docs = docs;
    this.funcs = Object.keys(docs);
    this.lowerFuncs = this.funcs.map((func) => func.toLowerCase());
  }

  async loadDocsAsync(provider: string | (() => Promise<Docs>)) {
    let docs: Docs;
    if (typeof provider === 'function') {
      docs = await provider();
    } else if (typeof provider === 'string') {
      docs = await (await fetch(provider)).json();
    } else {
      throw new Error('Invalid docs provider');
    }

    this.updateDocs(docs);
  }

  getFunctionMarkdown(name: string) {
    return this.docs?.[name]?.markdown;
  }

  getSignatures(name: string) {
    return this.docs?.[name]?.signatures;
  }

  /**
   * 查询补全项（包括关键字、常量和函数）
   * @param query
   * @returns
   */
  searchCompletionItems(query: string) {
    const queryLower = query.toLowerCase();

    return {
      keywords: keywords.filter((keyword) => keyword.startsWith(query)),
      constants: constants.filter((constant) => isCompletionMatch(constant, queryLower)),
      functions: this.funcs.filter((func, i) => isCompletionMatch(this.lowerFuncs[i], queryLower)),
    };
  }
}
