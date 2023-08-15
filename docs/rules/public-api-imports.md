# Restrict imports only from public API (public-api-imports)

Checks if absolute imports are from Public API (index.ts)

## Rule Details

This rule reports on absolute imports not from Public API for entities, features, pages, widgets layers. You should re-export data from index.ts file or from testing.ts for test data.

## Rule Options

- `alias`: specify this option if you use aliases.
- `testFilesPatterns`: specify regex for import from test files.

```js
...
'fsd-pathcheker/public-api-imports': ['error', { alias: string, testFilesPatterns: array }]
...
```

Example:

```js
'fsd-pathcheker/public-api-imports': [
      'error',
      {
        alias: '@',
        testFilesPatterns: [
          '**/*.test.*',
          '**/*.stories.*',
          '**/StoreDecorator.tsx',
        ],
      },
    ],
```

Project structure example:

```
src
  pages
    Main
      ui
        MainPage.tsx
      index.ts
  widgets
    Sidebar
      model
        types
          sidebar.ts
      ui
        Sidebar.tsx
      index.ts
      testing.ts
  shared
    config
      StoreDecorator.tsx
```

```js
// index.ts and testing.ts
export type { ISidebarItem } from './model/types/sidebar';
```

Examples of **incorrect** code for this rule:

```js
// "fsd-pathcheker/public-api-imports": "error"
// in MainPage.tsx
import { ISidebarItem } from 'widgets/Sidebar/model/types/sidebar';

// "fsd-pathcheker/public-api-imports": ["error", { alias: "@" }]
// in MainPage.tsx
import { ISidebarItem } from '@/widgets/Sidebar/model/types/sidebar';

// "fsd-pathcheker/public-api-imports": ["error", { alias: "@", testFilesPatterns: ['**/StoreDecorator.tsx'] }]
// in StoreDecorator.tsx
import { ISidebarItem } from '@/widgets/Sidebar/model/types/sidebar';
```

Examples of **correct** code for this rule:

```js
// "fsd-pathcheker/public-api-imports": "error"
// in MainPage.tsx
import { ISidebarItem } from 'widgets/Sidebar';

// "fsd-pathcheker/public-api-imports": ["error", { alias: "@"}]
// in MainPage.tsx
import { ISidebarItem } from '@/widgets/Sidebar';

// "fsd-pathcheker/public-api-imports": ["error", { alias: "@", testFilesPatterns: ['**/StoreDecorator.tsx'] }]
// in StoreDecorator.tsx
import { ISidebarItem } from '@/widgets/Sidebar/testing';
```

## When Not To Use It

If you do not use Feature Slices Design in your project.
