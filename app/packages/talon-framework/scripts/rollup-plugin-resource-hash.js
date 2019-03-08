import * as fs from 'fs';
import hash from 'rollup-plugin-hash';
import { getResourceUrl } from 'talon-common';

/**
 * Plugin that will output files into hash directories and write map to resources.json
 */
const PATH_DIST_RESOURCES = 'dist/resources.json';

export default function resourceHash({ mode, resourceDescriptor }) {
    const url = getResourceUrl(resourceDescriptor, mode, '[hash:10]');
    const plugin = hash({
        dest: `dist/public${url}`,
        replace: true,
        algorithm: 'md5',
        callback: (fileName) => {
            // get the uid/hash from the filename and add it to the resource map
            const uid = fileName.split('/').splice(-3)[0];
            const resources = fs.existsSync(PATH_DIST_RESOURCES) ? JSON.parse(fs.readFileSync(PATH_DIST_RESOURCES)) : {};
            resources[resourceDescriptor] = resources[resourceDescriptor] || {};
            resources[resourceDescriptor][mode] = uid;
            fs.writeFileSync(PATH_DIST_RESOURCES, JSON.stringify(resources, null, 4));
        }
    });
    return {
        ...plugin,
        name: 'rollup-plugin-resource-hash'
    };
}