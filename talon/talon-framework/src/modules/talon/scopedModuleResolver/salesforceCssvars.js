import { style } from 'talon/brandingService';

/**
 * Resolves '@salesforce/cssvars' resources.
 */
export default {
    scope: 'cssvars',

    resolve(resource) {
        if (resource === 'customProperties') {
            return style;
        }

        // leave someone else the chance to resolve the resource
        return null;
    }
};