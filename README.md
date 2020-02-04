# Commerce Storefront Sample Application &middot; [![CircleCI][circleci-image]][circleci-url]

Use our storefront sample application to learn how to build amazing commerce experiences with the latest Commerce Platform technologies.

## What is this?

The Commerce Storefront Sample Application demonstrates how to build a storefront experience using our latest Commerce Platform innovations. Using this sample app, developers can quickly learn how to build apps with the Lightning Web Components `(LWC)`, `Commerce Cloud NodeJS SDK`, `GraphQL`, and `Salesforce Commerce APIs`. The Sample Application shows an implementation of a product detail page, product list page, and homepage - which will help development teams quickly understand how to use these technologies and begin their own journey of building amazing commerce experiences.

> Note: This implementation is NOT a full-fledged e-commerce storefront and is not intended to be used as one.

Visit the [Commerce Cloud Developer Center](https://developer.commercecloud.com/) to learn more about Salesforce B2C Commerce. The developer center has API documentation, getting started guides, community forums, and more.

## Project Structure

<PLACEHOLDER>

## Pre-requisites

### For Installation and Setup
1) **[Node](https://nodejs.org/en/download/)** >=v12
2) yarn (install using `npm install yarn -g`)

### To Learn
* **[NodeJS](https://nodejs.org/en/docs/)**
* **[ECMAScript 6](http://www.ecma-international.org/ecma-262/6.0/)**
* **[SASS](https://sass-lang.com/guide)**
* **[GraphQL and Apollo](https://www.apollographql.com/docs/tutorial/introduction/)**
* **[Lightning Web Components](https://developer.salesforce.com/docs/component-library/documentation/lwc)**
* **[Jest](https://jestjs.io/docs/en/getting-started)**

## Setup
    git clone git@github.com:SalesforceCommerceCloud/sfcc-sample-apps.git
    cd sfcc-sample-apps
    yarn

    # Rename `api.example.js` to `api.js` and update the environment variables with your values.

    yarn build
    yarn start
    
    # Open browser with http://localhost:3000 to go to storefront.

## Testing & Debugging
1) `yarn test`
2) TODO - Debugging

## Configurations
* Logging Level can be changed in `api.js`. The supported log levels are

    * `TRACE`
    * `DEBUG`
    * `INFO`
    * `WARN`
    * `ERROR`
    * `SILENT`

    Change `COMMERCE_LOG_LEVEL` property accordingly.
* Server Listening Port can be changed in `lwc-services.config.js`

## Monorepo Instructions

sfcc-sample-apps is a monorepo with a sample application and bff dependency modules. Normally dependencies modules are published to a public npm server, but for the purpose of developing an application and the modules together everything is in a single repository here (monorepo).

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
