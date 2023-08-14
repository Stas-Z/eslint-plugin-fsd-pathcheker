const { isPathRelative } = require('../helpers');
const micromatch = require('micromatch');

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'Checks if absolute imports are from Public API (index.ts)',
      category: 'Fill me in',
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
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

        if (!checkingLayers[layer]) {
          return;
        }

        const isImportNotFromPublicApi = segments.length > 2;
        //[entities, article, testing]
        const isTestingPublicApi =
          segments[2] === 'testing' && segments.length < 4;

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report({
            node: node,
            message:
              'Absolute imports are allowed only from Public API (index.ts).',
          });
        }

        // example: C:\Users\stani\Desktop\myApp\production-project\src\features\AuthByUsername\model\slice\loginSlice.test.ts
        const currentFilePath = context.getFilename();

        const isCurrentFileTesting = testFilesPatterns.some((pattern) =>
          micromatch.isMatch(currentFilePath, pattern)
        );

        if (!isCurrentFileTesting && isTestingPublicApi) {
          context.report(
            node,
            'Test data must be imported only for tests files from Public API (testing.ts).'
          );
        }

        if (isCurrentFileTesting && !isTestingPublicApi) {
          context.report(
            node,
            'Test data must be imported from Public API (testing.ts).'
          );
        }
      },
    };
  },
};
