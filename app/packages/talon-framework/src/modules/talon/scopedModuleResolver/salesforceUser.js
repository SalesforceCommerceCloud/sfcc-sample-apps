import { getUser } from "talon/configProvider";

/**
 * Resolves '@salesforce/user' resources.
 */
export default {
    scope: 'user',

    resolve(resource) {
        const user = getUser();
        if (user && resource === 'isGuest') {
            return user[resource];
        }
        // leave someone else the chance to resolve the resource
        return null;
    }
};