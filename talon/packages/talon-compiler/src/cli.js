#!/usr/bin/env node

/*
    generateTemplateResources <templateDir> [<filter>] [options]

    Generate template resources

    Positionals:
    templateDir  The template root directory
    [filter]     A regular expression used to filter the resources to generate

    Options:
    --help           Show help                                           [boolean]
    --version        Show version number                                 [boolean]
    --srcDir         Source directory, used to compute the template versio key
    --modulesSrcDir  Where to get the template LCM modules from
    --viewsDir       Where to get the view metadata from
    --indexHtml      The index.html file path
    --routesJson     The routes.json file path
    --labelsJson     The labels.json file path
    --themeJson      The theme.json file path
    --outputDir      Output dir where resources will be written
    --locale         The locale to use
    --basePath       The base path to use in branding properties URL values
*/

require('colors');

const { log, error } = console;
const { startContext, endContext } = require('./context/context-service');
const metadataService = require('./metadata/metadata-service');
const routesService = require('./routes/route-service');
const resourceService = require('./resources/resource-service');

async function main(options = {}) {
    let exitCode = 0;

    // start context
    return startContext(options).then(context => {
        // get and validate routes
        const routes = metadataService.getRoutes();
        routesService.validateRoutes(routes);

        // get theme
        const theme = metadataService.getTheme();

        // get routes resources
        const { locale } = context;
        const filter = options.filter && new RegExp(options.filter, 'i');
        const resources = routesService.getRoutesResources(routes, theme, locale).filter(descriptor => {
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
        log('Done compiling components'.bold.blue);
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
        .usage('$0 <templateDir> [<filter>] [options]', 'Generate template resources', (yargs) => {
            yargs.positional('templateDir', {
                describe: 'The template root directory'
            }).positional('[filter]', {
                describe: 'A regular expression used to filter the resources to generate'
            });
        })
        .demand(1)
        .options({
            srcDir: { describe: 'Source directory, used to compute the template versio key' },
            modulesSrcDir: { describe: 'Where to get the template LCM modules from' },
            viewsDir: { describe: 'Where to get the view metadata from' },
            indexHtml: { describe: 'The index.html file path' },
            routesJson: { describe: 'The routes.json file path' },
            labelsJson: { describe: 'The labels.json file path' },
            themeJson: { describe: 'The theme.json file path' },
            outputDir: { describe: 'Output dir where resources will be written' },
            locale: { describe: 'The locale to use' },
            basePath: { describe: 'The base path to use in branding properties URL values' }
        })
        .help()
        .argv;

    const [templateDir, filter] = argv._;

    main({ templateDir, filter, ...argv });
}

module.exports = main;