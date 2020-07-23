# Commerce Storefront Sample Application &middot; [![CircleCI][circleci-image]][circleci-url]

Our storefront sample application shows how you can build amazing commerce experiences with the latest Commerce platform technologies. The sample application helps developers get started by proving out a clear path to successfully build a storefront using our latest platform technologies, such as the Salesforce Commerce API and the Salesforce Commerce Node.js SDK.

The sample application shows an example implementation of some basic storefront use cases. The implementation helps development teams quickly understand how to use our latest platform technologies and begin their own journey of building commerce experiences. It contains examples for the homepage, product list page, product detail page, and cart. While this sample application demonstrates some of the Salesforce and Commerce Cloud technologies, it’s provided as a purely educational and instructional demonstration and not as a fully functional deployable reference storefront. 

The application back end is built on the new Salesforce Commerce API (a RESTful headless API). The front end is built with Lightning Web Components (LWC). In between, it uses GraphQL and the Salesforce Commerce Node.js SDK.  Read more about the sample application [architecture](docs/architecture.md).

Have more questions? See the [Sample Application FAQ](https://developer.commercecloud.com/s/article/CommerceAPI-Sample-Application-FAQ).

## Prerequisites
1. Download and install [Node.js v12](https://nodejs.org/en/download/).
2. Install yarn: 
`npm install yarn -g`

## Setup

To set up the sample application:

1. Clone the sfcc-sample-apps repository:
`git clone git@github.com:SalesforceCommerceCloud/sfcc-sample-apps.git`

2. Change into the `sfcc-sample-apps` folder:
`cd sfcc-sample-apps`

3. Copy the `api.example.js` file located at `/packages/storefront-lwc/app/`, save it as `api.js`, and make sure `api.js` is added to your `.gitignore` file.

4. In the `api.js` file, provide values for the following variables:
<table>
<tr><th>Variable</th><th>Description</th></tr>
<tr><td><code>COMMERCE_CLIENT_API_SITE_ID</code></td><td>Unique site ID (for example, RefArch or SiteGenesis).</td></tr>
<tr><td><code>COMMERCE_CLIENT_CLIENT_ID</code></td><td>Unique ID used exclusively for API access. See <a href="https://documentation.b2c.commercecloud.salesforce.com/DOC1/topic/com.demandware.dochelp/content/b2c_commerce/topics/account_manager/b2c_account_manager_add_api_client_id.html">Add a Client API</a> for more information.</td></tr>
<tr><td><code>COMMERCE_CLIENT_REALM_ID</code></td><td>Unique four-character realm ID (for example, bblx).</td></tr>
<tr><td><code>COMMERCE_CLIENT_INSTANCE_ID</code></td><td>Unique instance ID within a realm (for example, 015 for an on-demand sandbox).</td></tr>
<tr><td><code>COMMERCE_CLIENT_SHORT_CODE</code></td><td>Unique region-specific merchant ID (for example, staging-001).</td></tr>
<tr><td><code>COMMERCE_SESSION_SECRET</code></td><td>Unique ID for session management (for example, thisisasecretkey).</td></tr>
<tr><td><code>COMMERCE_CORS</code></td><td>Optionally enable <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">CORS</a> for GraphQL on the defined domains (for example, enable all domains with "\*").</td></tr>
</table>

Note: You can obtain these values from your Account Executive (AE) or Customer Support Manager (CSM), except for COMMERCE_SESSSION_SECRET, which is an arbitrary unique value that you create yourself. If the COMMERCE_SESSION_SECRET key is not unique per customer application, session information can be unintentionally shared between ecommerce sites. 

5. Install dependencies:
`yarn`

6. Build the sample application:
`yarn build`

7. Start the sample application:
`yarn start:dev` (development mode) or
`yarn start` (production mode)

8. To access the application, open the browser to http://localhost:3000

You can optionally test the sample application:
`yarn test`

## Debug

We recommend Visual Studio Code inbuilt debugger to troubleshoot the code. The `.vscode` launch configuration is included in the repo. To debug using VSCode, see [VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging).

## Configuration
* You can change the logging levels by modifying the `COMMERCE_LOG_LEVEL` property in `api.js`. The supported log levels are:
    * `TRACE`
    * `DEBUG`
    * `INFO`
    * `WARN`
    * `ERROR`
    * `SILENT`
* You can also change the server listening port by changing the `port` property in `sfcc-sample-apps/packages/storefront-lwc/scripts/runtime.js`.

### Learn More About Supporting Technologies
* [NodeJS](https://nodejs.org/en/docs/)
* [ECMAScript 6](https://hacks.mozilla.org/category/es6-in-depth/)
* [Sass](https://sass-lang.com/guide)
* [GraphQL](https://graphql.org/learn/)
* [Apollo](https://www.apollographql.com/docs/tutorial/introduction/)
* [Lightning Web Components](https://lwc.dev/)
* [Jest](https://jestjs.io/docs/en/getting-started)
* [Visual Studio Code](https://code.visualstudio.com/docs)

## Library of Components
The sample app currently includes the following components:
* [Home Page](https://github.com/SalesforceCommerceCloud/sfcc-sample-apps/tree/master/packages/storefront-lwc/src/modules/commerce/home)
* [Product Detail](https://github.com/SalesforceCommerceCloud/sfcc-sample-apps/tree/master/packages/storefront-lwc/src/modules/commerce/productDetail)
* [Product Search Results](https://github.com/SalesforceCommerceCloud/sfcc-sample-apps/tree/master/packages/storefront-lwc/src/modules/commerce/productSearchResults)
* [Basket](https://github.com/SalesforceCommerceCloud/sfcc-sample-apps/tree/master/packages/storefront-lwc/src/modules/commerce/basket)


## Contributing

Note: As of 06/30/20, the integration branch has been removed from the sfcc-sample-apps repository. We recommend that you delete your local integration branch, if you have one.

* See [Contributing](CONTRIBUTING.md)

<!-- Markdown link & img dfn's -->
[circleci-image]: https://circleci.com/gh/SalesforceCommerceCloud/sfcc-sample-apps.svg?style=shield&circle-token=f34a55a59d7dfc30402e719996edf10092780b66
[circleci-url]: https://circleci.com/gh/SalesforceCommerceCloud/sfcc-sample-apps
