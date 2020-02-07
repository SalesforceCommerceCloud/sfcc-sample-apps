# Commerce Storefront Sample Application &middot; [![CircleCI][circleci-image]][circleci-url]

Use our storefront sample application to build amazing commerce experiences with the latest Commerce platform technologies.

## What is this?

Use this sample app to quickly build apps with the Lightning Web Components `(LWC)`, `Commerce Cloud NodeJS SDK`, `GraphQL`, and `Salesforce Commerce APIs`. The sample application shows you how to create a product detail page, product list page, and home page. 

> Note: The sample application isn't an actual commerce storefront. Use it only as a guide to help you build your own commerce storefront. 

Visit the [Commerce Cloud Developer Center](https://developer.commercecloud.com/) to learn more about Salesforce B2C Commerce, its API documentation, getting started guides, community forums, and more.

## Prerequisites

### Installation
Download and install Node.js v12 **[here](https://nodejs.org/en/download/)**
Install yarn using `npm install yarn -g`

### Technologies & Tools
* **[NodeJS](https://nodejs.org/en/docs/)**
* **[ECMAScript 6](https://hacks.mozilla.org/category/es6-in-depth/)**
* **[Sass](https://sass-lang.com/guide)**
* **[GraphQL](https://graphql.org/learn/)**
* **[Apollo](https://www.apollographql.com/docs/tutorial/introduction/)**
* **[Lightning Web Components](https://lwc.dev/)**
* **[Jest](https://jestjs.io/docs/en/getting-started)**
* **[Visual Studio Code](https://code.visualstudio.com/docs)**

## Set Up

    # To setup

    git clone git@github.com:SalesforceCommerceCloud/sfcc-sample-apps.git
    cd sfcc-sample-apps
    yarn
    # Rename `api.example.js` to `api.js` and update the environment variables with your values.

    # To build

    yarn build

    # To test

    yarn test

    # To start

    yarn start

    # Open the browser with http://localhost:3000 to go to the storefront.

## Debug

We recommend Visual Studio Code inbuilt debugger to troubleshoot the code. `.vscode` launch configuration is included in the repo. To debug using VSCode, see **[VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging)**.

## Configuration
* The logging level can be changed in `api.js`. The supported log levels are as follows:

    * `TRACE`
    * `DEBUG`
    * `INFO`
    * `WARN`
    * `ERROR`
    * `SILENT`

    Change `COMMERCE_LOG_LEVEL` property, as needed.
* The server listening port can be changed in `lwc-services.config.js`

## Monorepo Instructions

sfcc-sample-apps is a monorepo with a sample application and bff dependency modules. Typically, dependencies modules are published to a public npm server. However to develop an application, the modules are included together in a single repository.

## Useful Links

* **[Architecture Guide](ARCHITECTURE_GUIDE.md)**
* **[Implementation Details](IMPLEMENTATION_DETAILS.md)**
* **[FAQ](FAQ.md)**

## Contributing

* **[See Contributing](CONTRIBUTING.md)**

## Legal Notice

* **[See Legal](LEGAL.md)**

<!-- Markdown link & img dfn's -->
[circleci-image]: https://circleci.com/gh/SalesforceCommerceCloud/sfcc-sample-apps.svg?style=shield&circle-token=f34a55a59d7dfc30402e719996edf10092780b66
[circleci-url]: https://circleci.com/gh/SalesforceCommerceCloud/sfcc-sample-apps
