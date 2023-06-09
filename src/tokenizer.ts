import { INITIAL, Registry, type IGrammar, type StateStack, type IRawGrammar, IRawTheme } from 'vscode-textmate';

import { createOnigScanner, createOnigString } from 'vscode-oniguruma';
import type * as Monaco from 'monaco-editor';

import { tm_language } from 'dolphindb/language.js';
import { LANGUAGE_ID } from './constant.js';

import { theme_dark } from './theme/dark.js';
import { theme_light } from './theme/light.js';

const SCOPE_NAME = 'source.dolphindb';

const registry = new Registry({
  onigLib: Promise.resolve({ createOnigScanner, createOnigString }),

  async loadGrammar(scopeName: string): Promise<IRawGrammar | null> {
    if (scopeName !== SCOPE_NAME) return null;

    return tm_language as IRawGrammar;
  },
});

class TokensProviderCache {
  private scopeNameToGrammar: Map<string, Promise<IGrammar>> = new Map();

  constructor(private registry: Registry) {}

  async createEncodedTokensProvider(
    scopeName: string,
    encodedLanguageId: number
  ): Promise<Monaco.languages.EncodedTokensProvider> {
    const grammar = await this.getGrammar(scopeName, encodedLanguageId);

    return {
      getInitialState() {
        return INITIAL;
      },

      tokenizeEncoded(line: string, state: Monaco.languages.IState): Monaco.languages.IEncodedLineTokens {
        const tokenizeLineResult2 = grammar.tokenizeLine2(line, state as StateStack);
        const { tokens, ruleStack: endState } = tokenizeLineResult2;
        return { tokens, endState };
      },
    };
  }

  async getGrammar(scopeName: string, encodedLanguageId: number): Promise<IGrammar> {
    const grammar = this.scopeNameToGrammar.get(scopeName);
    if (grammar) return grammar;

    // We use loadGrammarWithConfiguration() rather than loadGrammar() because
    // we discovered that if the numeric LanguageId is not specified, then it
    // does not get encoded in the TokenMetadata.
    //
    // Failure to do so means that the LanguageId cannot be read back later,
    // which can cause other Monaco features, such as "Toggle Line Comment",
    // to fail.
    const promise = this.registry.loadGrammarWithConfiguration(scopeName, encodedLanguageId, {}).then((grammar) => {
      if (grammar) return grammar;
      else throw Error(`failed to load grammar for ${scopeName}`);
    });
    this.scopeNameToGrammar.set(scopeName, promise);
    return promise;
  }
}

export function setColorMap(monaco: typeof Monaco, theme: 'light' | 'dark' | IRawTheme) {
  // https://github.com/microsoft/monaco-editor/issues/2239#issuecomment-800868449
  const rawTheme = typeof theme === 'string' ? (theme === 'light' ? theme_light : theme_dark) : theme;
  registry.setTheme(rawTheme);
  const css_colors = registry.getColorMap();
  monaco.languages.setColorMap(css_colors);
}

export async function registerTokenizer(languages: typeof Monaco.languages) {
  languages.setLanguageConfiguration(LANGUAGE_ID, {
    comments: {
      // symbol used for single line comment. Remove this entry if your language does not support line comments
      lineComment: '//',

      // symbols used for start and end a block comment. Remove this entry if your language does not support block comments
      blockComment: ['/*', '*/'],
    },

    // symbols used as brackets
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')'],
    ],

    // symbols that are auto closed when typing
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"', notIn: ['string'] },
      { open: "'", close: "'", notIn: ['string'] },
      { open: '/**', close: ' */', notIn: ['string'] },
      { open: '/*', close: ' */', notIn: ['string'] },
    ],

    // symbols that that can be used to surround a selection
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '<', close: '>' },
    ],

    folding: {
      markers: {
        start: new RegExp('^\\s*//\\s*#?region\\b'),
        end: new RegExp('^\\s*//\\s*#?endregion\\b'),
      },
    },

    wordPattern: new RegExp(
      '(-?\\d*\\.\\d\\w*)|([^\\`\\~\\!\\@\\#\\%\\^\\&\\*\\(\\)\\-\\=\\+\\[\\{\\]\\}\\\\\\|\\;\\:\\\'\\"\\,\\.\\<\\>\\/\\?\\s]+)'
    ),

    indentationRules: {
      increaseIndentPattern: new RegExp('^((?!\\/\\/).)*(\\{[^}"\'`]*|\\([^)"\'`]*|\\[[^\\]"\'`]*)$'),
      decreaseIndentPattern: new RegExp('^((?!.*?\\/\\*).*\\*/)?\\s*[\\}\\]].*$'),
    },
  });

  const encodedLanguageId = languages.getEncodedLanguageId(LANGUAGE_ID);
  const tokenProvider = await new TokensProviderCache(registry).createEncodedTokensProvider(
    SCOPE_NAME,
    encodedLanguageId
  );
  languages.setTokensProvider(LANGUAGE_ID, tokenProvider);
}
