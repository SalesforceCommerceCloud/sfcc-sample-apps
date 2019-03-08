export { getOutputConfigs } from './output-configs';

export {
    getResourceUrl,
    parseUrl,
    resourceDescriptorToString,
    parseResourceDescriptor,
    RESOURCE_TYPES
} from './utils/resource-utils';

export { moduleSpecifierToElementName, elementNameToModuleSpecifier, moduleSpecifierToId, convertToKebabCase } from './utils/naming-utils';

export { getViewModuleName, getViewModuleFullyQualifiedName, VIEW_NAMESPACE } from './utils/view-utils';

export { compatBabelOptions } from './compat-babel-options';