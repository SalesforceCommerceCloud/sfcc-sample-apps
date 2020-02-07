# Architectural Overview

The sample app showcases the capabilities and best practices of building an e-commerce application on top of the Salesforce Commerce API. _It is not intended to be a full reference architecture._ The sample app consists of a NodeJS web server that acts as a back-end for front-end (BFF) to a storefront built with Lightning Web Components.

## Tech Stack

![Sample app tech stack](architecture.png)

#### Lightning Web Components
The application front-end is built with [Lightning Web Components](https://lwc.dev/) (LWC). LWC is a Salesforce framework for building user experiences in modern JavaScript and native web components. It uses the latest web standards that allow components to be built once and be portable between apps built with other frameworks.

#### GraphQL and Apollo
The client communicates to the BFF via GraphQL. GraphQL allows for minimal data transfer, validation and type checking between the server and client. The sample app comes with the interactive API explorer [GraphiQL](https://github.com/graphql/graphiql). Access GraphiQL by booting the sample app and navigating to http://localhost:3000/api. The sample app relies on [Apollo](https://www.apollographql.com/) for both the client and server side implementation of GraphQL. Apollo is an industry standard technology for GraphQL.

#### Salesforce Commerce NodeJS SDK
Salesforce has built a NodeJS library that makes communicating with the headless commerce APIs easy. The library is built with TypeScript, which provides autocomplete features within your IDE, which let you view available method, parameters, and class definitions inline in the code. The SDK is also promised based, which makes writing `async` functions for complex operations easy. Read more about the SDK at: https://github.com/SalesforceCommerceCloud/commerce-sdk

#### Salesforce Commerce API
Visit the Commerce Cloud Developer Center to learn more about the Salesforce Commerce API. The developer center has API documentation, getting started guides, community forums, and more.

## Project and Package Structure
Though the sample app currently only communicates with the Salesforce Commerce API, a real world storefront would likely have multiple data sources. The sample app architecture is setup to easily support many data sources. As a result, the project is a monorepo with multiple packages managed by [Lerna](https://github.com/lerna/lerna). The managed packages in the sample app are grouped into three categories:

#### @sfcc-core
Core modules for the BFF, including a service and extension registry and a logging abstraction.

#### @sfcc-bff
This is the data source implementation for the Salesforce Commerce API. It includes the GraphQL models and query and mutation resolvers. If you were to add a new data source to another API, another package grouping similar to `@sfcc-bff` should be created. Do not mix data sources within the same package of GraphQL models and resolvers.

#### storefront-lwc
The front-end application. Built with [lwc-services](https://www.npmjs.com/package/lwc-services).

## Customizing and Extending
When customizing or extending the sample app, none of the packages within `@sfcc-bff` and `@sfcc-core` should be modified. In the future, these packages will be published and consumed via NPM. Instead, a new custom package should be created within the monorepo that registers itself with `@sfcc-core` and provides access to data from a third party service.

![Sample App Project Layout](project-layout.png)

The core-graphql module within `@sfcc-core` is responsible for getting all the registered API modules, looping over them, aggregating  the schemas, resolvers and datasources, and then starting the Apollo Server with which the Apollo Client will communicate. To create a new BFF API module, we have to register it with core, create the Schema, Resolvers and Datasources needed, and expose them to the core-graphql module for aggregation through factory functions in the core-graphql module. 

## What's not included?
This is a sample application, and is not intended to be a full reference architecture. There are multiple components missing, some of which will be added in the future. Specifically, the app does not currently include:

1. **Authentication** - Required for a fully functional cart and checkout experience.
2. **CMS Integration** - Required to customize the storefront experience per user.
3. **Server-side Rendering** - Required for product listing search engine optimization.
4. **Component Portability** - Work needs to be done to re-use components outside of the sample app context.