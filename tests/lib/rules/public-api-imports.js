/**
 * @fileoverview Checks if absolute imports are from Public API (index.ts)
 * @author Stanislav
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/public-api-imports'),
  RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});

const aliasOptions = [
  {
    alias: '@',
  },
];
const testPatternOptions = [
  {
    alias: '@',
    testFilesPatterns: ['**/*.test.ts', '**/StoreDecorator.tsx'],
  },
];

ruleTester.run('public-api-imports', rule, {
  valid: [
    {
      code: "import { commentFormActions } from '../../model/slice/commentFormSlice'",
      errors: [],
    },
    {
      code: "import { commentFormActions } from '@/entities/Article'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename:
        'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\file.test.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: testPatternOptions,
    },
    {
      filename:
        'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: testPatternOptions,
    },
  ],

  invalid: [
    {
      code: "import { commentFormActions } from '@/entities/Article/model/file.ts'",
      errors: [
        {
          message:
            'Absolute imports are allowed only from Public API (index.ts).',
        },
      ],
      options: aliasOptions,
      output: "import { commentFormActions } from '@/entities/Article'",
    },
    {
      filename:
        'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing/file.tsx'",
      errors: [
        {
          message: 'Test data must be imported from Public API (testing.ts).',
        },
      ],
      options: testPatternOptions,
      output:
        "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
    },
    {
      filename:
        'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\StoreDecorator.tsx',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/features/ArticleComments/model/slices/articleCommentsSlice'",
      errors: [
        {
          message: 'Test data must be imported from Public API (testing.ts).',
        },
      ],
      options: testPatternOptions,
      output:
        "import { addCommentFormActions, addCommentFormReducer } from '@/features/ArticleComments/testing'",
    },
    {
      filename:
        'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\forbidden.ts',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
      errors: [
        {
          message:
            'Test data must be imported only for tests files from Public API (testing.ts).',
        },
      ],
      options: testPatternOptions,
      output:
        "import { addCommentFormActions, addCommentFormReducer } from '@/entities/Article/testing'",
    },
  ],
});
