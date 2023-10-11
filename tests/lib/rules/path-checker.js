/**
 * @fileoverview feature sliced relative path checker
 * @author Stanislav
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/path-checker'),
  RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' },
});
ruleTester.run('path-checker', rule, {
  valid: [
    {
      filename:
        'C:\\Users\\username\\Desktop\\myApp\\production-project\\src\\entities\\Article',
      code: "import { commentFormActions } from '../../model/slice/commentFormSlice'",
      errors: [],
    },
  ],

  invalid: [
    {
      filename:
        'C:\\Users\\username\\Desktop\\myApp\\production-project\\src\\entities\\Article',
      code: "import { commentFormActions } from '@/entities/Article/model/slice/commentFormSlice'",
      errors: [
        { message: 'Within a single slice, all paths must be relative.' },
      ],
      options: [
        {
          alias: '@',
        },
      ],
    },
    {
      filename:
        'C:\\Users\\username\\Desktop\\myApp\\production-project\\src\\entities\\Article',
      code: "import { commentFormActions } from 'entities/Article/model/slice/commentFormSlice'",
      errors: [
        { message: 'Within a single slice, all paths must be relative.' },
      ],
    },
  ],
});
