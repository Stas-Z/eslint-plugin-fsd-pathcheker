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
    },
  ],
});
