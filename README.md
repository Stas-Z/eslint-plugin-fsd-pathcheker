# eslint-plugin-fsd-pathcheker

plugin for production project

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
    "plugins": [
        "fsd-pathcheker"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "fsd-pathcheker/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


