#!/usr/bin/env node

/*
generateTemplateResources <templateDir> [<descriptor>] [options]

Generate template resources

Positionals:
  templateDir   The template root directory
  [descriptor]  The descriptor of the resource to generate e.g.
                component://x/cmp1@fr

Options:
  --version          Show version number                               [boolean]
  --talonConfigJson  The talon.config.json file path
  --srcDir           Source directory, used to compute the template versio key
  --viewsDir         Where to get the view metadata from
  --indexHtml        The index.html file path
  --routesJson       The routes.json file path
  --labelsJson       The labels.json file path
  --themeJson        The theme.json file path
  --outputDir        Output dir where resources will be written
  --locale           The locale to use
  --basePath         The base path to use in branding properties URL values
  --filter           A regular expression used to filter the resources to
                     generate
  --help             Show help                                         [boolean]
*/

require('colors');

const { log, error } = console;
const { performance } = require('perf_hooks');
const { startContext, endContext, getContext } = require('./context/context-service');
const metadataService = require('./metadata/metadata-service');
const resourceService = require('./resources/resource-service');
const routesService = require('./routes/route-service');
const validate = require('./metadata/metadata-validation');

async function main(options = {}) {
    const t0 = performance.now();
    let exitCode = 0;

    // start context
    return startContext(options)
    .then(validate)
    .then(() => {
        // generate a single resource
        if (options.descriptor) {
            return resourceService.get(options.descriptor);
        }

        // get routes
        const routes = metadataService.getRoutes();

        // get theme
        const theme = metadataService.getTheme();

        // get routes resources
        const { locale, isPreview } = getContext();
        const filter = options.filter && new RegExp(options.filter, 'i');
        const resources = routesService.getRoutesResources(routes, theme, locale, isPreview).filter(descriptor => {
            return !filter || filter.test(descriptor);
        });

        if (!resources.length) {
            throw new Error("No resource to generate");
        }

        // generate all resources
        return Promise.all(resources.map(descriptor => {
            return resourceService.get(descriptor);
        }));
    }).then(() => {
        log(`Done compiling templates in ${Math.floor(performance.now() - t0)} ms`.bold.blue);
    }).catch((err) => {
        error(err.stack || err.message || err);
        exitCode = 1;
    }).then(() => {
        endContext();
        process.exit(exitCode);
    });
}

if (require.main === module) {
    const argv = require('yargs')
        .usage('$0 <templateDir> [<descriptor>] [options]', 'Generate template resources', (yargs) => {
            yargs.positional('templateDir', {
                describe: 'The template root directory'
            }).positional('[descriptor]', {
                describe: 'The descriptor of the resource to generate e.g. component://x/cmp1@fr'
            });
        })
        .demand(1)
        .options({
            talonConfigJson: { describe: 'The talon.config.json file path' },
            srcDir: { describe: 'Source directory, used to compute the template versio key' },
            viewsDir: { describe: 'Where to get the view metadata from' },
            indexHtml: { describe: 'The index.html file path' },
            routesJson: { describe: 'The routes.json file path' },
            labelsJson: { describe: 'The labels.json file path' },
            themeJson: { describe: 'The theme.json file path' },
            outputDir: { describe: 'Output dir where resources will be written' },
            locale: { describe: 'The locale to use' },
            basePath: { describe: 'The base path to use in branding properties URL values' },
            filter: { describe: 'A regular expression used to filter the resources to generate' }
        })
        .help()
        .argv;

    const [templateDir, descriptor] = argv._;

    main({ templateDir, descriptor, ...argv });
}

module.exports = main;