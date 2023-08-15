const path = require('path');
const { isPathRelative } = require('../helpers');
const micromatch = require('micromatch');

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'Checking imports from upper layers by FSD architecture',
      category: 'Fill me in',
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: { type: 'string' },
          ignoreImportPatterns: { type: 'array' },
        },
      },
    ], // Add a schema if the rule has options
  },

  create(context) {
    const layers = {
      app: ['pages', 'widgets', 'features', 'entities', 'shared'],
      pages: ['widgets', 'features', 'entities', 'shared'],
      widgets: ['features', 'entities', 'shared'],
      features: ['entities', 'shared'],
      entities: ['entities', 'shared'],
      shared: ['shared'],
    };

    const availableLayers = {
      app: 'app',
      pages: 'pages',
      widgets: 'widgets',
      features: 'features',
      entities: 'entities',
      shared: 'shared',
    };

    const { alias = '', ignoreImportPatterns = [] } = context.options[0] ?? {};

    const getCurrentFileLayer = () => {
      // example: C:\Users\stani\Desktop\myApp\production-project\src\entities\Article
      const currentFilePath = context.getFilename();

      const normalizedPath = path.toNamespacedPath(currentFilePath);
      const projectPath = normalizedPath?.split('src')[1];
      const segments = projectPath?.split('\\'); // [ '', 'entities', 'Article' ]

      return segments?.[1]; // entities
    };

    const getImportLayer = (value) => {
      // example: app/entities/Article
      const importPath = alias ? value.replace(`${alias}/`, '') : value;
      const segments = importPath?.split('/');

      return segments?.[0]; //app
    };

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFileLayer = getCurrentFileLayer();
        const importLayer = getImportLayer(importPath);

        if (isPathRelative(importPath)) {
          return;
        }

        if (
          !availableLayers[importLayer] ||
          !availableLayers[currentFileLayer]
        ) {
          return;
        }

        const isIgnored = ignoreImportPatterns.some((pattern) => {
          return micromatch.isMatch(importPath, pattern);
        });

        if (isIgnored) {
          return;
        }

        if (!layers[currentFileLayer]?.includes(importLayer)) {
          context.report(
            node,
            `A layer can only import from the layers strictly below. (${layers[
              currentFileLayer
            ].join(', ')})`
          );
        }
      },
    };
  },
};
