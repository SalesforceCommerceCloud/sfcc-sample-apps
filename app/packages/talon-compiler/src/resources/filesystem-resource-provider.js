const mkdirp = require('mkdirp');
const path = require('path');
const { getResourceUrl } = require('talon-common');
const fs = require('../utils/filesystem');
const { log } = console;
const { getContext } = require('../context/context-service');
const StaticResource = require('./static-resource');
const { promisify } = require('util');
const stream = require('stream');

require('colors');

const RESOURCES_FILE = 'resources.json';
const RESOURCE_DIR = 'public';

function loadUids(outputDir) {
    const file = `${outputDir}/${RESOURCES_FILE}`;
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}

function appendUids(outputDir, { versionKey, descriptor, uids }) {
    const resources = loadUids(outputDir);
    resources[versionKey] = resources[versionKey] || {};
    resources[versionKey][descriptor] = uids;

    const file = `${outputDir}/${RESOURCES_FILE}`;
    fs.writeFileSync(file, JSON.stringify(resources, null, 4));
}

/**
 * Loads resources from the filesystem is available, or delegate
 * to the next provider/generator.
 */
class FileSystemResourceProvider {
    async get(descriptor, isOptional, chain) {
        const { outputDir, versionKey } = getContext();

        const resources = loadUids(outputDir);

        // return the resource if it is already present
        if (resources[versionKey] && resources[versionKey][descriptor]) {
            const uids = resources[versionKey] && resources[versionKey][descriptor];
            return new StaticResource({ descriptor, uids });
        }

        // return null if we're not supposed to generate the resource
        if (isOptional) {
            return null;
        }

        // delegate to the resource generator
        const staticResource = await chain.get(descriptor, isOptional);
        const { contents, uids } = staticResource;

        // write the resource to disk
        await Promise.all(Object.entries(contents).map(([mode]) => {
            const uid = uids[mode];
            const url = getResourceUrl(descriptor, mode, uid);
            const outputFile = `${outputDir}/${RESOURCE_DIR}${url}`;

            // create output dir
            mkdirp.sync(path.dirname(outputFile));

            // write
            log(`Writing ${outputFile}...`.dim);
            const pipeline = promisify(stream.pipeline);
            const write = fs.createWriteStream(outputFile);
            return pipeline(staticResource.getReadableStream(mode), write);
        }));

        // add this resource uids to the map resources.json file in the output dir
        appendUids(outputDir, { versionKey, descriptor, uids });

        return staticResource;
    }
}

module.exports = FileSystemResourceProvider;