import { assert } from './assert';

export const VIEW_NAMESPACE = 'talonGenerated';

const VIEW_PREFIX = 'view__';

/**
 * Get the LWC module name, without namespace, for the given view.
 *
 * The module name is the view name with a `view__` prefix.
 *
 * @param {*} viewName The name of the view to get the module name for
 * @returns the LWC module name for the given view
 */
export function getViewModuleName(viewName) {
    assert(viewName, 'View name must be specified');
    return `${VIEW_PREFIX}${viewName}`;
}

/**
 * Get the fully qualified LWC module name for the given view
 * including the namespace
 *
 * @param {*} viewName The name of the view to get the fully qualified module name for
 * @returns the fully qualified LWC module name for the given view
 */
export function getViewModuleFullyQualifiedName(viewName) {
    return `${VIEW_NAMESPACE}/${getViewModuleName(viewName)}`;
}