Integration tests use [Puppeteer](https://github.com/GoogleChrome/puppeteer) and [faker.js](https://github.com/Marak/Faker.js#readme). 

# Run the integration tests

From `<talon home>`: 

```bash
yarn test:integration
```

From `<talon home>/packages/talon-integration`: 

```bash
jest
```

or (better output): 

```bash
jest --verbose
```

By default the tests are run in headless mode. Use the `HEADLESS` environment variable to turn it off:  

```bash
HEADLESS=false jest --verbose
```

Most tests should be run in all compile modes by default (at least `dev` and `prod` until we fix `compat` and `prod_compat`). Use the `MODE` environment variable to force a particular mode: 

```bash
MODE=prod jest --verbose
```
