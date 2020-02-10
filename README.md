# Commerce Storefront Sample Application &middot; [![CircleCI][circleci-image]][circleci-url]

Our storefront sample application shows how you can build amazing commerce experiences with the latest Commerce platform technologies. The application back end is built on the new Salesforce Commerce API (a RESTful headless API), and the front end is built with Lightning Web Components (LWC). In between, it uses GraphQL and the Salesforce Commerce Node.js SDK. 

Read more about the architecture [here](docs/architecture.md).

The sample application shows you a recommended approach for building a storefront, but it is not a complete and fully functional storefront reference application. At present, the sample application includes a home page, product list page, and product detail page. More great features are coming soon!

## Prerequisites
1. Download and install Node.js v12 [here](https://nodejs.org/en/download/).
2. Install yarn: 
`npm install yarn -g`


## Setup

To set up the sample application, perform the following steps:

1. Clone the sfcc-sample-apps repository:
`git clone git@github.com:SalesforceCommerceCloud/sfcc-sample-apps.git`

2. Change into the `sfcc-sample-apps` folder:
`cd sfcc-sample-apps`

3. Copy `api.example.js` file located at `/packages/storefront-lwc/scripts/`, save it as `api.js`, and make sure it is added to your `.gitignore` file.

4. In the `api.js`, provide values for the following variables (you can obtain these values from your Account Executive (AE) or Customer Support Manager (CSM)):
<table>
<tr><th>Variable</th><th>Description</th></tr>
<tr><td><code>APP_API_INSTANCE</code></td><td>Fully qualified domain name (FQDN) for your instance (for example, dev01.web.mycompany.demandware.net).</td></tr>
<tr><td><code>APP_API_SITE_ID</code></td><td>A unique site ID (for example, RefArch or SiteGenesis).</td></tr>
<tr><td><code>COMMERCE_CLIENT_CLIENT_ID</code></td><td>A unique ID used exclusively for API access. See <a href="https://documentation.b2c.commercecloud.salesforce.com/DOC1/topic/com.demandware.dochelp/AccountManager/AccountManagerAddAPIClientID.html">Add a Client API</a> for more information.</td></tr>
<tr><td><code>COMMERCE_CLIENT_REALM</code></td><td>A unique four-character ID (for example, bblx).</td></tr>
<tr><td><code>COMMERCE_CLIENT_INSTANCE</code></td><td>Instance ID within a realm (for example, 015).</td></tr>
</table>

5. Install dependencies:
`yarn`

6. Build the sample application:
`yarn build`

7. Start the sample application:
`yarn start:dev` (development mode) or
`yarn start` (production mode)


8. To access the sample application in developmnet mode, open the browser to http://localhost:3000 and for production mode http://localhost:3002

You can optionally test the sample application:
`yarn test`

## Debug

We recommend Visual Studio Code inbuilt debugger to troubleshoot the code. `.vscode` launch configuration is included in the repo. To debug using VSCode, see [VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging).

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

sfcc-sample-apps is a monorepo with a sample application and Backend For Frontend (BFF) dependency modules. Typically, dependencies modules are published to a public npm server. However to develop an application, the modules are included together in a single repository.

### Learn More about Supporting Technologies
* [NodeJS](https://nodejs.org/en/docs/)
* [ECMAScript 6](https://hacks.mozilla.org/category/es6-in-depth/)
* [Sass](https://sass-lang.com/guide)
* [GraphQL](https://graphql.org/learn/)
* [Apollo](https://www.apollographql.com/docs/tutorial/introduction/)
* [Lightning Web Components](https://lwc.dev/)
* [Jest](https://jestjs.io/docs/en/getting-started)
* [Visual Studio Code](https://code.visualstudio.com/docs)

## Contributing

* [See Contributing](CONTRIBUTING.md)


<!-- Markdown link & img dfn's -->
[circleci-image]: https://circleci.com/gh/SalesforceCommerceCloud/sfcc-sample-apps.svg?style=shield&circle-token=f34a55a59d7dfc30402e719996edf10092780b66
[circleci-url]: https://circleci.com/gh/SalesforceCommerceCloud/sfcc-sample-apps
