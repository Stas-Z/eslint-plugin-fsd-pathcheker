const { isPathRelative } = require('../helpers');
const micromatch = require('micromatch');

const PUBLIC_ERROR = 'PUBLIC_ERROR';
const TESTING_PUBLIC_ERROR = 'TESTING_PUBLIC_ERROR';
const TESTING_ERROR = 'TESTING_ERROR';

module.exports = {
  meta: {
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'Checks if absolute imports are from Public API (index.ts)',
      recommended: true,
      url: 'https://github.com/Stas-Z/eslint-plugin-fsd-pathcheker/blob/master/docs/rules/public-api-imports.md', // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`,
    messages: {
      [PUBLIC_ERROR]:
        'Absolute imports are allowed only from Public API (index.ts).',
      [TESTING_PUBLIC_ERROR]:
        'Test data must be imported only for tests files from Public API (testing.ts).',
      [TESTING_ERROR]:
        'Test data must be imported from Public API (testing.ts).',
    },
    schema: [
      // Add a schema if the rule has options
      {
        type: 'object',
        properties: {
          alias: { type: 'string' },
          testFilesPatterns: { type: 'array' },
        },
      },
    ],
  },

  create(context) {
    const { alias = '', testFilesPatterns = [] } = context.options[0] ?? {};

    const checkingLayers = {
      pages: 'pages',
      widgets: 'widgets',
      features: 'features',
      entities: 'entities',
    };

    return {
      ImportDeclaration(node) {
        // example: app/entities/Article
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        if (isPathRelative(importTo)) {
          return;
        }

        //[entities, article, model, types]
        const segments = importTo.split('/');
        const layer = segments[0];
        const slice = segments[1];

        if (!checkingLayers[layer]) {
          return;
        }

        // example: C:\production-project\src\features\AuthByUsername\model\slice\loginSlice.test.ts
        const currentFilePath = context.getFilename();

        const isCurrentFileTesting = testFilesPatterns.some((pattern) =>
          micromatch.isMatch(currentFilePath, pattern)
        );

        const isImportNotFromPublicApi = segments.length > 2;
        //[entities, article, testing]
        const isTestingPublicApi =
          segments[2] === 'testing' && segments.length < 4;

        if (
          isImportNotFromPublicApi &&
          !isTestingPublicApi & !isCurrentFileTesting
        ) {
          context.report({
            node,
            messageId: PUBLIC_ERROR,
            fix: (fixer) => {
              return fixer.replaceText(
                node.source,
                `'${alias ? alias + '/' : ''}${layer}/${slice}'`
              );
            },
          });
        }

        if (!isCurrentFileTesting && isTestingPublicApi) {
          context.report({ node, messageId: TESTING_PUBLIC_ERROR });
        }

        if (isCurrentFileTesting && !isTestingPublicApi) {
          context.report({
            node,
            messageId: TESTING_ERROR,
            fix: (fixer) => {
              return fixer.replaceText(
                node.source,
                `'${alias ? alias + '/' : ''}${layer}/${slice}/testing'`
              );
            },
          });
        }
      },
    };
  },
};
