# Commerce Storefront Sample Application &middot; [![CircleCI][circleci-image]][circleci-url]

Use our storefront sample application to learn how to build amazing commerce experiences with the latest Commerce Platform technologies.

## What is this?

The Commerce Storefront Sample Application demonstrates how to build a storefront experience using our latest Commerce Platform innovations. Using this sample app, developers can quickly learn how to build apps with the Lightning Web Components `(LWC)`, `Commerce Cloud NodeJS SDK`, `GraphQL`, and `Salesforce Commerce APIs`. The Sample Application shows an implementation of a product detail page, product list page, and homepage - which will help development teams quickly understand how to use these technologies and begin their own journey of building amazing commerce experiences.

> Note: This implementation is NOT a full-fledged e-commerce storefront and is not intended to be used as one.

Visit the [Commerce Cloud Developer Center](https://developer.commercecloud.com/) to learn more about Salesforce B2C Commerce. The developer center has API documentation, getting started guides, community forums, and more.

## Legal Notice

[See Legal](LEGAL.md)

## Pre-requisites

### For Intallation and Setup
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
1) `git clone git@github.com:SalesforceCommerceCloud/sfcc-sample-apps.git`
2) `cd sfcc-sample-apps`
3) `yarn` (install if needed `npm install yarn -g`)
4) Rename `api.example.js` to `api.js` and update the environment variables with your values.
5) `yarn build`
6) `yarn start`
7) Open browser with http://localhost:3000 to go to storefront.

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

## Developer Heroku Deploy
1) `heroku login` to open browser and login with `youremail@yourdomain.com`
2) `heroku create` to create your own Heroku app.
3) `git remote -v` to ensure you have a repo in the Heroku git server. 
3) New Heroku app will be at https://dashboard.heroku.com/apps
4) Make any changes locally and git commit to your branch.
5) `git push heroku [yourbranch]:master` to deploy your changes.

## Monorepo Instructions

sfcc-sample-apps is a monorepo with a sample application and bff dependency modules. Normally dependencies modules are published to a public npm server, but for the purpose of developing an application and the modules together everything is in a single repository here (monorepo).

## Contributing

[See Contributing](CONTRIBUTING.md)

<!-- Markdown link & img dfn's -->
[circleci-image]: https://circleci.com/gh/SalesforceCommerceCloud/sfcc-sample-apps.svg?style=shield&circle-token=f34a55a59d7dfc30402e719996edf10092780b66
[circleci-url]: https://circleci.com/gh/SalesforceCommerceCloud/sfcc-sample-apps
