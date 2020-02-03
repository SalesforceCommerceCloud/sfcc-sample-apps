# SFCC Sample Applications

Reference apps and libraries based on `LWC`, `sfcc-core` and `sfcc-bff`.

## Legal Notice

[See Legal](LEGAL.md)

## Pre-requisites

### To Intall and Setup
1) Node >v12.0 from https://nodejs.org/en/download/
2) yarn (install using `npm install yarn -g`)

### To Learn
1) NodeJS
2) ECMAScript 6
3) SASS
4) GraphQL and Apollo
5) Lightning Web Components
6) Jest

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

## Configurations
1) Logging Level can be changed in api.js. The supported log levels are `{ 'TRACE': 0, 'DEBUG': 1, 'INFO': 2, 'WARN': 3, 'ERROR': 4, 'SILENT': 5}`. Change `COMMERCE_LOG_LEVEL = LOG_LEVEL_MAP.DEBUG;` accordingly.
2) Listening Port can be changed in `lwc-services.config.js`

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
