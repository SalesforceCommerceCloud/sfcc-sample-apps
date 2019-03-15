## Core Commerce SDK Modules and SFRA Modules

We are working on The Salesforce Commerce Cloud Storefront Reference Architecture with Lightning Web Components.

- `sfcc` mono-repo: The runtime core shared code (non-storefront specific). 
    - Instructions at [sfcc](sfcc/README.md) 

- `sfra`: mono-repo: The storefront extensions and services and storefront BFFs. Depend on `sfcc` modules.
    - Instructions at [sfra](sfra/README.md) 

Modules are published as `@sfcc-dev/[module]` at `https://npm.lwcjs.org`

Storefront Reference Application located at: [sfra-next-app](https://github.com/SalesforceCommerceCloud/sfra-next-app)