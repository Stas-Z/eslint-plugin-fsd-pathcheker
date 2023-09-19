# Check if path should be relative according to Feature-sliced design methodology. (path-checker)

Check imports have relative path within single slice in project used Feature Slice Design (FSD). Auto-fix available.

## Rule Details

**Example of file path:**

`Import to:` C:\production-project\src\entities\Article\ui\ArticleList\ArticleList.tsx

`Import from:` C:\production-project\src\entities\Article\model\types\article.ts

`Import from:` C:\production-project\src\shared\ui\Text\Text.tsx

Examples of **incorrect** code for this rule:

```js
import { Article } from '@/entities/Article/model/types/article';
```

Examples of **correct** code for this rule:

```js
import { Text, TextSize } from '@/shared/ui/Text/Text';
import { Article } from '../../model/types/article';
```

### Options

- `alias`: specify this option if you use aliases.

```js
...
'fsd-pathcheker/path-checker': ['error', { alias: string }]
...
```

Example:

```js
'fsd-pathcheker/path-checker': ['error', { alias: '@' }],
```

Will allow the following code:

```js
import { UserCard } from '@/entities/User/ui/UserCard/UserCard';
```

## When Not To Use It

If you do not use Feature Slices Design in your project.

## Further Reading

https://feature-sliced.design/docs
