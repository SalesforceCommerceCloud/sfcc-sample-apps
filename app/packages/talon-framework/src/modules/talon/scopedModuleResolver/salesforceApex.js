import { getApexInvoker } from 'talon/apexUtils';

/**
 * Resolves '@salesforce/apex' resources.
 */
export default {
    scope: 'apex',

    resolve(resource) {
        return getApexInvoker(resource);
    }
};
