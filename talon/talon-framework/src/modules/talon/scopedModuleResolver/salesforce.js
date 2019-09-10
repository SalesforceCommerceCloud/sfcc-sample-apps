import { Resolver } from './resolver';
import apex from './salesforceApex';
import cssvars from './salesforceCssvars';
import user from './salesforceUser';

const salesforceResolver = new Resolver([
    apex,
    cssvars,
    user
]);

/**
 * Resolves '@salesforce' resources.
 */
export default {
    scope: '@salesforce',

    resolve(resource) {
        return salesforceResolver.resolve(resource);
    }
};