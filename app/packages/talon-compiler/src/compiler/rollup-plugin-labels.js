const metadataService = require('../metadata/metadata-service');

const LABEL_PREFIX = '@salesforce/label/';

/**
 * Return the value of a label given its id of the form
 * @salesforce/label/section.name, or `undefined` if the label
 * cannot be found.
 */
function getLabelValue(id) {
    if (id.startsWith(LABEL_PREFIX)) {
        const labels = metadataService.getLabels();
        const [section, name] = id.split('/')[2].split('.');
        if (labels[section]) {
            return labels[section][name];
        }
    }
    return undefined;
}

/**
 * Rollup plugin to load labels from labels.json
 */
function labelsPlugin() {
    return  {
        name: 'rollup-plugin-talon-labels',

        load(id) {
            const label = getLabelValue(id);
            return (label && `export default ${JSON.stringify(label)};`) || null;
        },

        // need to append js extension so that it goes through LWC transformer
        resolveId(id) {
            const label = getLabelValue(id);
            return (label && `${id}.js`) || null;
        }
    };
}

module.exports = labelsPlugin;