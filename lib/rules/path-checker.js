const path = require('path');
const { isPathRelative } = require('../helpers');

module.exports = {
  meta: {
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'feature sliced relative path checker',
      recommended: true,
      url: 'https://github.com/Stas-Z/eslint-plugin-fsd-pathcheker/blob/master/docs/rules/path-checker.md', // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
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
    return {
      ImportDeclaration(node) {
        // example: app/entities/Article
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        // example: C:\Users\stani\Desktop\myApp\production-project\src\entities\Article
        const fromFilename = context.getFilename();

        if (shouldBeRelative(fromFilename, importTo)) {
          context.report({
            node: node,
            message: 'Within a single slice, all paths must be relative.',
            fix: (fixer) => {
              const normalizedPath = getNormalizedCurrentFilePath(fromFilename) // /entities/Article/Article.tsx
                .split('/')
                .slice(0, -1)
                .join('/');
              let relativePath = path
                .relative(normalizedPath, `/${importTo}`)
                .split('\\')
                .join('/');

              if (!relativePath.startsWith('.')) {
                relativePath = './' + relativePath;
              }

              return fixer.replaceText(node.source, `'${relativePath}'`);
            },
          });
        }
      },
    };
  },
};

const layers = {
  pages: 'pages',
  widgets: 'widgets',
  features: 'features',
  entities: 'entities',
  shared: 'shared',
};

function getNormalizedCurrentFilePath(currentFilePath) {
  const fromNormalizedPath = path.toNamespacedPath(currentFilePath);
  const fromPath = fromNormalizedPath.split('src')[1];
  const isWindowsOS = fromNormalizedPath.includes('\\');
  return fromPath.split(isWindowsOS ? '\\' : '/').join('/');
}

function shouldBeRelative(from, to) {
  if (isPathRelative(to)) {
    return false;
  }
  // example: app/entities/Article
  const toArray = to.split('/');
  const toLayer = toArray[0]; // entities
  const toSlice = toArray[1]; // Article

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  // example: C:\Users\stani\Desktop\myApp\production-project\src\entities\Article
  const fromPath = getNormalizedCurrentFilePath(from);
  const fromArray = fromPath.split('/'); // [ '', 'entities', 'Article' ]

  const fromLayer = fromArray[1]; // entities
  const fromSlice = fromArray[2]; // Article

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromSlice === toSlice && toLayer === fromLayer;
}

// console.log(shouldBeRelative('C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article', 'entities/Article/fasfasfas'))
// console.log(shouldBeRelative('C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article', 'entities/ASdasd/fasfasfas'))
// console.log(shouldBeRelative('C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article', 'features/Article/fasfasfas'))
// console.log(shouldBeRelative('C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\features\\Article', 'features/Article/fasfasfas'))
// console.log(shouldBeRelative('C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article', 'app/index.tsx'))
// console.log(shouldBeRelative('C:/Users/tim/Desktop/javascript/GOOD_COURSE_test/src/entities/Article', 'entities/Article/asfasf/asfasf'))
// console.log(shouldBeRelative('C:\\Users\\tim\\Desktop\\javascript\\GOOD_COURSE_test\\src\\entities\\Article', '../../model/selectors/getSidebarItems'))
