import type * as Monaco from 'monaco-editor';
import { DocsAnalyser, parse_signature_help_from_text } from 'dolphindb/docs.js';
import { LANGUAGE_ID } from './constant.js';

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

      const { functions, constants, keywords } = docsAnalyser.search_completion_items(keyword);

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
      const md = docsAnalyser.get_function_markdown(item.label as string);

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

      const md = docsAnalyser.get_function_markdown(word.word);

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

      const result = parse_signature_help_from_text(text, docsAnalyser);
      if (!result) {
        return;
      }

      const { signature, active_parameter, documentation_md } = result;

      return {
        dispose() {},

        value: {
          activeSignature: 0,
          activeParameter: -1,
          signatures: [
            {
              label: signature.full,
              activeParameter: active_parameter,
              documentation: documentation_md ? wrapMarkdownString(documentation_md) : undefined,
              parameters: signature.parameters.map((param) => ({
                label: param.full,
              })),
            },
          ],
        },
      };
    },
  });
}
