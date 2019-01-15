import { assert } from './assert';

const moduleSpecifierPattern = new RegExp(/^[a-z-A-Z_\d]+[/]{1}[a-zA-Z_\d]+$/);
const elementNamePattern = new RegExp(/^([a-z_\d]+[-]{1}[a-z_\d]+)+$/);

/**
 * Converts an LWC element name (e.g. community_flashhelp-shop-button) to the
 * corresponding module specifier (e.g. community_flashhelp/shopButton)
 */
export function elementNameToModuleSpecifier(elementName) {
    if (moduleSpecifierPattern.test(elementName)) {
        return elementName;
    }

    assert(elementNamePattern.test(elementName), `${elementName} is an invalid element name.`);

    const parts = elementName.split('-');
    return parts.length >= 2 ?
        parts[0] + '/' + parts[1] + parts.slice(2).map(part => part[0].toUpperCase() + part.substring(1)).join('') :
        elementName;
}

/**
 * Converts an LWC module specifier (e.g. community_flashhelp/shopButton) to the
 * corresponding element name (e.g. community_flashhelp-shop-button)
 */
export function moduleSpecifierToElementName(moduleSpecifier) {
    if (elementNamePattern.test(moduleSpecifier)) {
        return moduleSpecifier;
    }

    assert(moduleSpecifierPattern.test(moduleSpecifier), `${moduleSpecifier} is an invalid module specifier.`);

    let parts = moduleSpecifier.split('/');
    parts = parts.reduce((acc, part) => {
        // thanks https://gist.github.com/nblackburn/875e6ff75bc8ce171c758bf75f304707
        acc.push(part.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase());
        return acc;
    }, []);
    return parts.join("-");
}