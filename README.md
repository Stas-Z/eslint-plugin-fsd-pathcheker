# eslint-plugin-fsd-pathcheker

Plugin for checking imports path in [FSD](https://feature-sliced.design/) project.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-fsd-pathcheker`:

```sh
npm install eslint-plugin-fsd-pathcheker --save-dev
```

## Usage

Add `fsd-pathcheker` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["fsd-pathcheker"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "fsd-pathcheker/path-checker": "error",
    "fsd-pathcheker/public-api-imports": "error",
    "fsd-pathcheker/layer-imports": "error"
  }
}
```

## Rules

Check FSD imports is correct:

| Name                                                   | Description                                                                        |
| :----------------------------------------------------- | :--------------------------------------------------------------------------------- |
| [path-checker](docs/rules/path-checker.md)             | Check if path should be relative according to Feature-sliced design methodology.   |
| [layer-imports](docs/rules/layer-imports.md)           | Checking imports from upper layers according to Feature-sliced design methodology. |
| [public-api-imports](docs/rules/public-api-imports.md) | Checks if absolute path imports from public api                                    |
