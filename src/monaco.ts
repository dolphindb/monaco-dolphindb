import type * as Monaco from 'monaco-editor';
import { DocsAnalyser } from './docs/analyser.js';
import { LANGUAGE_ID } from './constant.js';
import { parseSignatureHelpFromText } from './docs/parse-signature-help-from-text.js';

/** 最大搜索行数 */
const MAX_MATCH_LINES = 30;

let docsAnalyser: DocsAnalyser;

export function setDocsAnalyser(newDocsAnalyser: DocsAnalyser) {
  docsAnalyser = newDocsAnalyser;
}

export function registerMonacoLanguageProviders(monaco: typeof Monaco) {
  const { languages } = monaco;
  const { CompletionItemKind } = languages;

  if (!docsAnalyser) {
    throw new Error('You must set docsAnalyser first');
  }

  function wrapMarkdownString(md: string) {
    return {
      isTrusted: true,
      value: md,
    };
  }

  languages.registerCompletionItemProvider(LANGUAGE_ID, {
    provideCompletionItems(model, pos) {
      const keyword = model.getWordAtPosition(pos)?.word ?? '';

      const { functions, constants, keywords } = docsAnalyser.searchCompletionItems(keyword);

      return {
        suggestions: [
          ...keywords.map((kw) => ({
            label: kw,
            insertText: kw,
            kind: CompletionItemKind.Keyword,
          })),
          ...constants.map((constant) => ({
            label: constant,
            insertText: constant,
            kind: CompletionItemKind.Constant,
          })),
          ...functions.map((fn) => ({
            label: fn,
            insertText: fn,
            kind: CompletionItemKind.Function,
          })),
        ] as Monaco.languages.CompletionItem[],
      };
    },

    resolveCompletionItem(item) {
      const md = docsAnalyser.getFunctionMarkdown(item.label as string);

      if (md) {
        item.documentation = wrapMarkdownString(md);
      }

      return item;
    },
  });

  languages.registerHoverProvider(LANGUAGE_ID, {
    provideHover(doc, pos, _canceller) {
      const word = doc.getWordAtPosition(pos);

      if (!word) {
        return;
      }

      const md = docsAnalyser.getFunctionMarkdown(word.word);

      if (!md) {
        return;
      }

      return {
        contents: [wrapMarkdownString(md)],
      };
    },
  });

  languages.registerSignatureHelpProvider(LANGUAGE_ID, {
    signatureHelpTriggerCharacters: ['(', ','],

    provideSignatureHelp(doc, pos) {
      const text = doc.getValueInRange({
        startLineNumber: Math.max(pos.lineNumber - MAX_MATCH_LINES, 0),
        startColumn: 0,
        endLineNumber: pos.lineNumber,
        endColumn: pos.column,
      });

      const result = parseSignatureHelpFromText(text, docsAnalyser);
      if (!result) {
        return;
      }

      const { signature, activeParameter, documentationMD } = result;

      return {
        dispose() {},

        value: {
          activeSignature: 0,
          activeParameter: -1,
          signatures: [
            {
              label: signature.fullText,
              activeParameter: activeParameter,
              documentation: documentationMD ? wrapMarkdownString(documentationMD) : undefined,
              parameters: signature.parameters.map((param) => ({
                label: param.fullText,
              })),
            },
          ],
        },
      };
    },
  });
}
