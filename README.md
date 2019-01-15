# SFRA vNext Spike

We are working on The Salesforce Commerce Cloud Storefront Reference Architecture with Lightning Web Components.

- `sfra`: The runtime core/modules
- `talon`: The reference app based on `Talon` which imports the `@sfra/core` and `@sfra/[modules]`

##### To run in folder `sfra`...
- 1 start verdaccio
- 2 build and publish @sfra/core
- 3 build and publish @sfra/[modules]
- 4 start the runtime: `node start.js`