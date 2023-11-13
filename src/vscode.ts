import {
  ExtensionContext,
  DocumentSelector,
  languages,
  CompletionItemKind,
  CompletionItem,
  MarkdownString,
  Range,
} from 'vscode';
import type { DocsAnalyser } from './docs/analyser.js';
import { parseSignatureHelpFromText } from './docs/parse-signature-help-from-text.js';

const MAX_MATCH_LINES = 30;

export function registerVSCodeLanguageProviders(
  ctx: ExtensionContext,
  language: DocumentSelector = ['dolphindb', 'dolphindb-python'],
  docsAnalyser: DocsAnalyser
) {
  function wrapMarkdownString(md: string) {
    return new MarkdownString(md);
  }

  ctx.subscriptions.push(
    languages.registerCompletionItemProvider(language, {
      provideCompletionItems(doc, pos) {
        const keyword = doc.getText(doc.getWordRangeAtPosition(pos));

        const { functions, constants, keywords } = docsAnalyser.searchCompletionItems(keyword);

        return [
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
        ] satisfies CompletionItem[];
      },
      resolveCompletionItem(item, _canceller) {
        const md = docsAnalyser.getFunctionMarkdown(item.label as string);

        if (md) {
          item.documentation = wrapMarkdownString(md);
        }

        return item;
      },
    }),
    languages.registerHoverProvider(language, {
      provideHover(doc, pos, _canceller) {
        const word = doc.getText(doc.getWordRangeAtPosition(pos));

        if (!word) {
          return;
        }

        const md = docsAnalyser.getFunctionMarkdown(word);

        if (!md) {
          return;
        }

        return {
          contents: [wrapMarkdownString(md)],
        };
      },
    }),
    languages.registerSignatureHelpProvider(
      language,
      {
        provideSignatureHelp(doc, position, _canceller) {
          const text = doc.getText(
            new Range(Math.max(position.line - MAX_MATCH_LINES, 0), 0, position.line, position.character)
          );

          const result = parseSignatureHelpFromText(text, docsAnalyser);
          if (!result) {
            return;
          }

          const { activeParameter, documentationMD, signature } = result;

          return {
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
          };
        },
      },
      {
        triggerCharacters: ['(', ','],
        retriggerCharacters: [','],
      }
    )
  );
}
