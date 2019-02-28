# Building and Starting the App

## Install

```bash
yarn build
```

## Build

To build all the packages (from the root folder) or a particular one (from `packages/talon-xxx`): 

```bash
yarn build
```

Or if you only need a particular compile mode: 

```bash
MODE=dev yarn build
```

## Start the server

If you want to run Talon locally, then follow these commands:

```bash
yarn start
```

Or if you only need a particular compile mode: 

```bash
MODE=dev yarn start
```

`yarn start` does build the packages, no need to call `yarn build` first. 

To start the server without building the packages: 

```bash
yarn serve
```

## View examples

Load the examples in a browser: http://localhost:3000/

To force the compile mode: http://localhost:3000/?mode=dev