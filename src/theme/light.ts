// Theme data derived from:
// https://github.com/microsoft/vscode/raw/a716714a88891cad69c0753fb95923870df295f5/extensions/theme-defaults/themes/dark_plus.json

import type { IRawTheme } from 'vscode-textmate'

// This satisfies the contract of IRawTheme as defined in vscode-textmate.
export const theme_light: IRawTheme = {
    name: 'dolphindb.light',
    settings: [
        {
            settings: {
                foreground: '#000000',
                background: '#ffffff'
            }
        },
        {
            scope: ['meta.embedded', 'source.groovy.embedded'],
            settings: {
                foreground: '#000000ff'
            }
        },
        {
            scope: 'emphasis',
            settings: {
                fontStyle: 'italic'
            }
        },
        {
            scope: 'strong',
            settings: {
                fontStyle: 'bold'
            }
        },
        {
            scope: 'meta.diff.header',
            settings: {
                foreground: '#000080'
            }
        },
        {
            scope: 'comment',
            settings: {
                foreground: '#000000'
            }
        },
        {
            scope: 'constant.language',
            settings: {
                foreground: '#0000ff'
            }
        },
        {
            scope: ['constant.numeric', 'variable.other.enummember', 'keyword.operator.plus.exponent', 'keyword.operator.minus.exponent'],
            settings: {
                foreground: '#ff0000'
            }
        },
        {
            scope: 'constant.regexp',
            settings: {
                foreground: '#811f3f'
            }
        },
        {
            name: 'css tags in selectors, xml tags',
            scope: 'entity.name.tag',
            settings: {
                foreground: '#800000'
            }
        },
        {
            scope: 'entity.name.selector',
            settings: {
                foreground: '#800000'
            }
        },
        {
            scope: 'entity.other.attribute-name',
            settings: {
                foreground: '#ff0000'
            }
        },
        {
            scope: [
                'entity.other.attribute-name.class.css',
                'entity.other.attribute-name.class.mixin.css',
                'entity.other.attribute-name.id.css',
                'entity.other.attribute-name.parent-selector.css',
                'entity.other.attribute-name.pseudo-class.css',
                'entity.other.attribute-name.pseudo-element.css',
                'source.css.less entity.other.attribute-name.id',
                'entity.other.attribute-name.scss'
            ],
            settings: {
                foreground: '#800000'
            }
        },
        {
            scope: 'invalid',
            settings: {
                foreground: '#cd3131'
            }
        },
        {
            scope: 'markup.underline',
            settings: {
                fontStyle: 'underline'
            }
        },
        {
            scope: 'markup.bold',
            settings: {
                fontStyle: 'bold',
                foreground: '#000080'
            }
        },
        {
            scope: 'markup.heading',
            settings: {
                fontStyle: 'bold',
                foreground: '#800000'
            }
        },
        {
            scope: 'markup.italic',
            settings: {
                fontStyle: 'italic'
            }
        },
        {
            scope: 'markup.strikethrough',
            settings: {
                fontStyle: 'strikethrough'
            }
        },
        {
            scope: 'markup.inserted',
            settings: {
                foreground: '#098658'
            }
        },
        {
            scope: 'markup.deleted',
            settings: {
                foreground: '#a31515'
            }
        },
        {
            scope: 'markup.changed',
            settings: {
                foreground: '#0451a5'
            }
        },
        {
            scope: ['punctuation.definition.quote.begin.markdown', 'punctuation.definition.list.begin.markdown'],
            settings: {
                foreground: '#0451a5'
            }
        },
        {
            scope: 'markup.inline.raw',
            settings: {
                foreground: '#800000'
            }
        },
        {
            name: 'brackets of XML/HTML tags',
            scope: 'punctuation.definition.tag',
            settings: {
                foreground: '#800000'
            }
        },
        {
            scope: ['meta.preprocessor', 'entity.name.function.preprocessor'],
            settings: {
                foreground: '#0000ff'
            }
        },
        {
            scope: 'meta.preprocessor.string',
            settings: {
                foreground: '#a31515'
            }
        },
        {
            scope: 'meta.preprocessor.numeric',
            settings: {
                foreground: '#098658'
            }
        },
        {
            scope: 'meta.structure.dictionary.key.python',
            settings: {
                foreground: '#0451a5'
            }
        },
        {
            scope: 'storage',
            settings: {
                foreground: '#0000ff'
            }
        },
        {
            scope: 'storage.type',
            settings: {
                foreground: '#0000ff'
            }
        },
        {
            scope: ['storage.modifier', 'keyword.operator.noexcept'],
            settings: {
                foreground: '#0000ff'
            }
        },
        {
            scope: ['string', 'meta.embedded.assembly'],
            settings: {
                foreground: '#a31515'
            }
        },
        {
            scope: [
                'string.comment.buffered.block.pug',
                'string.quoted.pug',
                'string.interpolated.pug',
                'string.unquoted.plain.in.yaml',
                'string.unquoted.plain.out.yaml',
                'string.unquoted.block.yaml',
                'string.quoted.single.yaml',
                'string.quoted.double.xml',
                'string.quoted.single.xml',
                'string.unquoted.cdata.xml',
                'string.quoted.double.html',
                'string.quoted.single.html',
                'string.unquoted.html',
                'string.quoted.single.handlebars',
                'string.quoted.double.handlebars'
            ],
            settings: {
                foreground: '#0000ff'
            }
        },
        {
            scope: 'string.regexp',
            settings: {
                foreground: '#811f3f'
            }
        },
        {
            name: 'String interpolation',
            scope: [
                'punctuation.definition.template-expression.begin',
                'punctuation.definition.template-expression.end',
                'punctuation.section.embedded'
            ],
            settings: {
                foreground: '#0000ff'
            }
        },
        {
            name: 'Reset JavaScript string interpolation expression',
            scope: ['meta.template.expression'],
            settings: {
                foreground: '#000000'
            }
        },
        {
            scope: [
                'support.constant.property-value',
                'support.constant.font-name',
                'support.constant.media-type',
                'support.constant.media',
                'constant.other.color.rgb-value',
                'constant.other.rgb-value',
                'support.constant.color'
            ],
            settings: {
                foreground: '#0451a5'
            }
        },
        {
            scope: [
                'support.type.vendored.property-name',
                'support.type.property-name',
                'variable.css',
                'variable.scss',
                'variable.other.less',
                'source.coffee.embedded'
            ],
            settings: {
                foreground: '#ff0000'
            }
        },
        {
            scope: ['support.type.property-name.json'],
            settings: {
                foreground: '#0451a5'
            }
        },
        {
            scope: 'keyword',
            settings: {
                foreground: '#0000ff'
            }
        },
        {
            scope: 'keyword.control',
            settings: {
                foreground: '#0000ff'
            }
        },
        {
            scope: 'keyword.operator',
            settings: {
                foreground: '#000000'
            }
        },
        {
            scope: [
                'keyword.operator.new',
                'keyword.operator.expression',
                'keyword.operator.cast',
                'keyword.operator.sizeof',
                'keyword.operator.alignof',
                'keyword.operator.typeid',
                'keyword.operator.alignas',
                'keyword.operator.instanceof',
                'keyword.operator.logical.python',
                'keyword.operator.wordlike'
            ],
            settings: {
                foreground: '#0000ff'
            }
        },
        {
            scope: 'keyword.other.unit',
            settings: {
                foreground: '#098658'
            }
        },
        {
            scope: ['punctuation.section.embedded.begin.php', 'punctuation.section.embedded.end.php'],
            settings: {
                foreground: '#800000'
            }
        },
        {
            scope: 'support.function.git-rebase',
            settings: {
                foreground: '#0451a5'
            }
        },
        {
            scope: 'constant.sha.git-rebase',
            settings: {
                foreground: '#098658'
            }
        },
        {
            name: 'coloring of the Java import and package identifiers',
            scope: ['storage.modifier.import.java', 'variable.language.wildcard.java', 'storage.modifier.package.java'],
            settings: {
                foreground: '#000000'
            }
        },
        {
            name: 'this.self',
            scope: 'variable.language',
            settings: {
                foreground: '#0000ff'
            }
        },
        
        // adds rules to the light vs rules
        {
            name: 'Function declarations',
            scope: [
                'entity.name.function',
                'support.function',
                'support.constant.handlebars',
                'source.powershell variable.other.member',
                'entity.name.operator.custom-literal' // See https://en.cppreference.com/w/cpp/language/user_literal
            ],
            settings: {
                foreground: '#795E26'
            }
        },
        {
            name: 'Types declaration and references',
            scope: [
                'support.class',
                'support.type',
                'entity.name.type',
                'entity.name.namespace',
                'entity.other.attribute',
                'entity.name.scope-resolution',
                'entity.name.class',
                'storage.type.numeric.go',
                'storage.type.byte.go',
                'storage.type.boolean.go',
                'storage.type.string.go',
                'storage.type.uintptr.go',
                'storage.type.error.go',
                'storage.type.rune.go',
                'storage.type.cs',
                'storage.type.generic.cs',
                'storage.type.modifier.cs',
                'storage.type.variable.cs',
                'storage.type.annotation.java',
                'storage.type.generic.java',
                'storage.type.java',
                'storage.type.object.array.java',
                'storage.type.primitive.array.java',
                'storage.type.primitive.java',
                'storage.type.token.java',
                'storage.type.groovy',
                'storage.type.annotation.groovy',
                'storage.type.parameters.groovy',
                'storage.type.generic.groovy',
                'storage.type.object.array.groovy',
                'storage.type.primitive.array.groovy',
                'storage.type.primitive.groovy'
            ],
            settings: {
                foreground: '#0f96be'
            }
        },
        {
            name: 'Types declaration and references, TS grammar specific',
            scope: [
                'meta.type.cast.expr',
                'meta.type.new.expr',
                'support.constant.math',
                'support.constant.dom',
                'support.constant.json',
                'entity.other.inherited-class'
            ],
            settings: {
                foreground: '#267f99'
            }
        },
        {
            name: 'Control flow / Special keywords',
            scope: [
                'keyword.control',
                'source.cpp keyword.operator.new',
                'source.cpp keyword.operator.delete',
                'keyword.other.using',
                'keyword.other.operator',
                'entity.name.operator'
            ],
            settings: {
                foreground: '#AF00DB'
            }
        },
        {
            name: 'Variable and parameter name',
            scope: [
                'variable',
                'meta.definition.variable.name',
                'support.variable',
                'entity.name.variable',
                'constant.other.placeholder' // placeholders in strings
            ],
            settings: {
                foreground: '#000000'
            }
        },
        {
            name: 'Constants and enums',
            scope: ['variable.other.constant', 'variable.other.enummember'],
            settings: {
                foreground: '#0070C1'
            }
        },
        {
            name: 'Object keys, TS grammar specific',
            scope: ['meta.object-literal.key'],
            settings: {
                foreground: '#001080'
            }
        },
        {
            name: 'CSS property value',
            scope: [
                'support.constant.property-value',
                'support.constant.font-name',
                'support.constant.media-type',
                'support.constant.media',
                'constant.other.color.rgb-value',
                'constant.other.rgb-value',
                'support.constant.color'
            ],
            settings: {
                foreground: '#0451a5'
            }
        },
        {
            name: 'Regular expression groups',
            scope: [
                'punctuation.definition.group.regexp',
                'punctuation.definition.group.assertion.regexp',
                'punctuation.definition.character-class.regexp',
                'punctuation.character.set.begin.regexp',
                'punctuation.character.set.end.regexp',
                'keyword.operator.negation.regexp',
                'support.other.parenthesis.regexp'
            ],
            settings: {
                foreground: '#d16969'
            }
        },
        {
            scope: [
                'constant.character.character-class.regexp',
                'constant.other.character-class.set.regexp',
                'constant.other.character-class.regexp',
                'constant.character.set.regexp'
            ],
            settings: {
                foreground: '#811f3f'
            }
        },
        {
            scope: 'keyword.operator.quantifier.regexp',
            settings: {
                foreground: '#000000'
            }
        },
        {
            scope: ['keyword.operator.or.regexp', 'keyword.control.anchor.regexp'],
            settings: {
                foreground: '#EE0000'
            }
        },
        {
            scope: 'constant.character',
            settings: {
                foreground: '#0000ff'
            }
        },
        {
            scope: 'constant.character.escape',
            settings: {
                foreground: '#EE0000'
            }
        },
        {
            scope: 'entity.name.label',
            settings: {
                foreground: '#000000'
            }
        },
        { scope: 'keyword.operator', settings: { foreground: '#f00' } },
        { scope: 'keyword.operator.instanceof', settings: { foreground: '#f00' } },
        { scope: 'keyword.operator.logical', settings: { foreground: '#f00' } },
        { scope: 'keyword.operator.logical.python', settings: { foreground: '#f00' } },
        
        // { "scope": "keyword.control", "settings": { "foreground": "#bc00eb" } }
        
        // { "scope": "support.type.property-name", "settings": { "foreground": "#0451a5" } },
        { scope: 'support.type.property-name', settings: { foreground: '#000000' } },
        
        // { "scope": "variable.other", "settings": { "foreground": "#000000", "fontStyle": ""  } },
        // { "scope": "variable.parameter", "settings": { "foreground": "#000000", "fontStyle": ""  } },
        { scope: 'variable', settings: { foreground: '#000000', fontStyle: '' } },
        // { "scope": "variable.other.property", "settings": { "foreground": "#0115AF" } },
        { scope: 'variable.other.constant', settings: { foreground: '#000000' } },
        
        { scope: 'keyword.operator.expression.typeof.js', settings: { foreground: '#f00' } },
        { scope: 'storage.type', settings: { foreground: '#0000ee' } }, // const
        { scope: 'storage.modifier', settings: { foreground: '#0000ee' } },
        { scope: 'constant.language', settings: { foreground: '#0000ee' } },
        { scope: 'constant.numeric', settings: { foreground: '#00a000' } }, // number
        { scope: 'variable.language.this', settings: { foreground: '#267f99' } },
        { scope: 'string.quoted.docstring.multi.python', settings: { foreground: '#000000' } },
        { scope: 'punctuation.separator.delimiter.c', settings: { foreground: '#f00' } },
        { scope: 'punctuation.separator.pointer-access.c', settings: { foreground: '#f00' } },
        { scope: 'entity.name.tag.pug', settings: { foreground: '#f00' } },
        { scope: 'entity.other.attribute-name.id.pug', settings: { foreground: '#722dd2' } },
        { scope: 'entity.other.attribute-name.class.pug', settings: { foreground: '#267f99' } },
        { scope: 'entity.other.attribute-name.tag.pug', settings: { foreground: '#8e5e1a' } },
        { scope: 'entity.name.tag', settings: { foreground: '#000000', fontStyle: 'bold' } },
        
        { scope: 'punctuation.definition.tag', settings: { foreground: '#000000', fontStyle: 'bold' } },
        
        // function: bold
        { scope: 'entity.name.function', settings: { foreground: '#000000', fontStyle: 'bold' } },
        { scope: 'support.function', settings: { foreground: '#000000', fontStyle: 'bold' } },
        
        { scope: 'constant.language.module.http', settings: { foreground: '#00f' } },
        { scope: 'constant.language.directive.module', settings: { foreground: '#00f' } },
        { scope: 'constant.language.directive.module.main', settings: { foreground: '#f00', fontStyle: 'bold' } },
        
        { scope: 'meta.decorator.dolphindb', settings: { foreground: '#aa6f00' } },
        
        { scope: 'punctuation.definition.string.begin.json.comments', settings: { foreground: '#111' } },
        { scope: 'punctuation.definition.string.end.json.comments', settings: { foreground: '#111' } },
        { scope: 'punctuation.support.type.property-name.begin.json.comments', settings: { foreground: '#111' } },
        { scope: 'punctuation.support.type.property-name.end.json.comments', settings: { foreground: '#111' } }
    ]
}
