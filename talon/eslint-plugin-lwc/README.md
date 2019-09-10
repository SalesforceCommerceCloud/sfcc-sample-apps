# eslint-plugin-lwc

> Official ESLint configuration and rules for LWC

## Installation

```
$ npm install eslint eslint-plugin-lwc --save-dev
```

## Usage

Add `lwc` to the plugins section of your configuration and extend from one of the [configuration](#configurations). For more details about configuration please refer to the dedicated section in the ESLint documentation: https://eslint.org/docs/user-guide/configuring

Example of `.eslintrc.json`:
```json
{
    "plugins": ["lwc"],
    "extends": ["plugin:lwc/recommended", "plugin:lwc/style"]
}
```

## Configurations

This package exposes 4 configurations.

### `lwc/base` configuration

**Goal:** Prevent common pitfalls with LWC, and other platform restrictions.

**Rules:** LWC specific rules only.

### `lwc/recommended` configuration

**Goal:** It prevents common Javascript pitfalls and enforces all the best practices. It ensures a common styling across the codebase.

**Rules:** `lwc/base` rules + Most of the base [*Potential errors*](https://eslint.org/docs/rules/#possible-errors) rules + Some of the [*Best Practices*](https://eslint.org/docs/rules/#best-practices) rules.


### `lwc/extended` configuration

**Goal:** It restricts usage of some common features in the Javascript language that are known to be slow after the COMPAT transformation.

**Rules:** `lwc/recommended` rules + restrict usage of some slow patterns in COMPAT

### `lwc/style` configuration

**Goal:** It enforces a set the code style rules used for LWC modules.

**Rules:** Some of the [Stylistic Issues](https://eslint.org/docs/rules/#stylistic-issues) and [*Best Practices*](https://eslint.org/docs/rules/#best-practices) rules.

## Rules

### LWC

| Rule ID | Description |
|---------|-------------|
| [lwc/no-deprecated](./docs/rules/no-deprecated.md) | disallow usage of deprecated LWC APIs |
| [lwc/no-document-query](./docs/rules/no-document-query.md) | Disallow DOM query at the document level |
| [lwc/valid-api](./docs/rules/valid-api.md) | validate `api` decorator usage |
| [lwc/valid-track](./docs/rules/valid-track.md) | validate `track` decorator usage |
| [lwc/valid-wire](./docs/rules/valid-wire.md) | validate `wire` decorator usage |
| [lwc/no-wire-service](./docs/rules/no-wire-service.md) | disallow import of `wire-service` |

### Best practices

| Rule ID | Description |
|---------|-------------|
| [lwc/no-async-operation](./docs/rules/no-async-operation.md) | restrict usage of async operations |
| [lwc/no-inner-html](./docs/rules/no-inner-html.md) | disallow usage of `innerHTML` |
| [lwc/no-process-env](./docs/rules/no-process-env.md) | restrict usage of the `process` global object |

### Aura compatibility

| Rule ID | Description |
|---------|-------------|
| [lwc/no-aura-libs](./docs/rules/no-aura-libs.md) | disallow import of Aura libraries |
| [lwc/no-aura](./docs/rules/no-aura.md) | disallow usage of `$A` |
| [lwc/no-compat-create](./docs/rules/no-compat-create.md) | disallow import of `createComponent` from `aura` |
| [lwc/no-compat-dispatch](./docs/rules/no-compat-dispatch.md) | disallow import of `dispatchGlobalEvent` from `aura` |
| [lwc/no-compat-execute](./docs/rules/no-compat-execute.md) | disallow import of `executeGlobalController` from `aura` |
| [lwc/no-compat-module-instrumentation](./docs/rules/no-compat-module-instrumentation.md) | disallow import of `aura-instrumentation` |
| [lwc/no-compat-module-storage](./docs/rules/no-compat-module-storage.md) | disallow import of `aura-storage` |
| [lwc/no-compat-register](./docs/rules/no-compat-register.md) | disallow import of `registerModule` from `aura` |
| [lwc/no-compat-sanitize](./docs/rules/no-compat-sanitize.md) | disallow import of `sanitizeDOM` from `aura` |
| [lwc/no-compat](./docs/rules/no-compat.md) | disallow import of `aura` |

### Compat performance

| Rule ID | Description |
|---------|-------------|
| [lwc/no-async-await](./docs/rules/no-async-await.md) | disallow usage of the async-await syntax |
| [lwc/no-for-of](./docs/rules/no-for-of.md) | disallow usage of the for-of syntax |
| [lwc/no-rest-parameter](./docs/rules/no-rest-parameter.md) | disallow usage of the rest parameter syntax |

### Platform requirements

| Rule ID | Description |
|---------|-------------|
| [lwc/no-inline-disable](./docs/rules/no-inline-disable.md) | disallow inline disablement of ESLint rule |

### Deprecated

<details>
<summary>Show deprecated rules</summary>
<br>

| Rule ID | Description |
|---------|-------------|
| [lwc/no-raf](./docs/rules/no-raf.md) | disallow usage of `requestAnimationFrame` |
| [lwc/no-set-interval](./docs/rules/no-set-interval.md) | disallow usage of `setInterval` |
| [lwc/no-set-timeout](./docs/rules/no-set-timeout.md) | disallow usage of `setTimeout` |

</details>

## Contributing

Once the repository has been cloned you can run the following commands from the root directory.

```sh
$ npm install       # install project dependencies
$ npm lint          # run linting against project code
$ npm test          # run test and code coverage
```