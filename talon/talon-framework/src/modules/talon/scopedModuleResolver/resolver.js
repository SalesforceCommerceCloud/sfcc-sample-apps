import { autoBind } from 'talon/utils';

/**
 * Split a string into its scope and resource.
 * The scope is the part of the string before the first '/' character.
 *
 * @returns an array whose first element is the scope
 *          and second element is the resource, e.g.
 *          '@scope/resource' => ['@scope', 'resource']
 */
function splitScopedResource(scopedResource) {
    const [scope, ...resource] = scopedResource.split('/');
    return [scope, resource.join('/')];
}

/**
 * A resolver delegating to underlying resolvers for each scope.
 */
export class Resolver {
    /**
     * @param {Object[]} resolversByScope an array of objects
     *                      each with a scope property
     *                      and a resolve method
     */
    constructor(resolversByScope) {
        this.resolvers = []
            .concat(resolversByScope || [])
            .filter(resolverByScope => !!resolverByScope)
            .reduce((resolvers, { scope, resolve }) => {
                resolvers[scope] = resolve;
                return resolvers;
            }, {});

        return autoBind(this);
    }

    resolve(scopedResource) {
        const [scope, resource] =  splitScopedResource(scopedResource);
        const resolve = this.resolvers[scope];

        if (resolve) {
            return resolve(resource);
        }

        // leave someone else the chance to resolve the resource
        return null;
    }
}