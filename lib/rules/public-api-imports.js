const { isPathRelative } = require('../helpers');

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
        },
      },
    ],
  },

  create(context) {
    const alias = context.options[0]?.alias || '';

    const checkingLayers = {
      pages: 'pages',
      widgets: 'widgets',
      features: 'features',
      entities: 'entities',
    };

    return {
      ImportDeclaration(node) {
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

        if (isImportNotFromPublicApi) {
          context.report({
            node: node,
            message:
              'Absolute imports are allowed only from Public API (index.ts).',
          });
        }
      },
    };
  },
};
