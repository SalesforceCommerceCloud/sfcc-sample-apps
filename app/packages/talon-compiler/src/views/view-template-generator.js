const { moduleSpecifierToElementName, moduleSpecifierToId, convertToKebabCase } = require('talon-common');
const { generateAttributesJS, DEFAULT_ATTRIBUTES } = require('./attributes-js-generator');

const pretty = require("pretty");
const ATTRIBUTE_REFERENCE = "attributes";

function regions(regionList, isThemeLayout, attributeSet, isRenderDesignTime) {
    let html = '';
    if (regionList && regionList.length) {
        regionList.forEach(region => {
            let regionHtml = '';
            if (region.components && region.components.length) {
                region.components.forEach(cmp => {
                    regionHtml += isRenderDesignTime ? getDropZone() : '';
                    regionHtml += component(cmp, false, region.name, attributeSet, false, isRenderDesignTime).html;
                });
                regionHtml += isRenderDesignTime ? getDropZone() : '';
            }

            html += isRenderDesignTime ? getRegionWrapper(region.name, regionHtml) : regionHtml;
        });
    }

    return `${html}
    ${isThemeLayout ? defaultSlot() : ""}`;
}

function getRegionWrapper(regionName, regionHtml) {
    const slotAttribute = regionName ? `slot="${regionName}"` : ``;
    return `<talondesign-region-wrapper ${slotAttribute}>${regionHtml}</talondesign-region-wrapper>`;
}

function getDropZone() {
    return `<talondesign-drop-region></talondesign-drop-region>`;
}

function defaultSlot() {
    return `<talon-router-container></talon-router-container>`;
}

function attributes(cmp, attributeSet, cmpNameKey) {
    if (!cmp.attributes) {
        return {html: '', attributes: attributeSet};
    }

    let attrHtml = '';
    Object.entries(cmp.attributes).forEach(([attributeName, attributeValue]) => {
        attrHtml += ` ${convertToKebabCase(attributeName)}={${ATTRIBUTE_REFERENCE}.${cmpNameKey}.${attributeName}}`;
        // Store attribute value for runtime injection
        attributeSet[cmpNameKey] = attributeSet[cmpNameKey] || {};
        attributeSet[cmpNameKey][attributeName] = attributeValue;
    });

    return {html: attrHtml, attributes: attributeSet};
}

function buildSlot(slotName, isRenderDesignTime) {
    return `${slotName && !isRenderDesignTime ? ` slot="${slotName}"` : ""} `;
}

function component(cmp, isThemeLayout, regionName, attributeSet = {}, isTopLevel, isRenderDesignTime) {
    const isRenderWrapper = !isTopLevel && isRenderDesignTime;
    const elem = moduleSpecifierToElementName(cmp.name);
    const cmpNameKey = getCmpNameKey(cmp, attributeSet);
    const attrs = attributes(cmp, attributeSet, cmpNameKey);
    const slot = buildSlot(regionName, isRenderDesignTime);
    const rgns = regions(cmp.regions, isThemeLayout, attrs.attributes, isRenderDesignTime);

    const cmpHtml = `<${elem}${attrs.html}${slot}>${rgns}</${elem}>`;

    const html = isRenderWrapper ? getComponentWrapper(cmp, cmpNameKey) : cmpHtml;

    return { html, attributes: attrs };
}

function getCmpNameKey(cmp, attributeSet) {
    const componentName = moduleSpecifierToId(cmp.name);
    const globalCmpIdx = Object.keys(attributeSet).length;
    return [componentName, globalCmpIdx].join("_");
}

function getComponentWrapper(cmp, cmpNameKey) {
    const attributesAttr = cmp.attributes ? `attributes={${ATTRIBUTE_REFERENCE}.${cmpNameKey}}` : '';
    return `<talondesign-component-wrapper ${attributesAttr} name="${cmp.name}"></talondesign-component-wrapper>`;
}

/**
 * Generate an LWC template for a provided component
 *
 * @param {object*} cmp - The top level component to render an LWC template for
 * @param {boolean} isThemeLayout - Whether that component is a theme layout or not
 */
function template(cmp, isThemeLayout, isRenderDesignTime = false) {
    const result = component(cmp, isThemeLayout, null, {}, true, isRenderDesignTime);
    const attributesVal = generateAttributesJS(result.attributes.attributes);
    return { "html": pretty(`<template>${result.html}</template>`, {ocd: true}), "attributes": attributesVal };
}

/**
 * Generates javascript which imports an HTML file and exports the HTML as default
 *
 * @param {string} moduleName - The name of the view, used to specify the import location of the HTML
 * @param {string} attributesVal - The attribute set value of the view, used to inject component attribute values during runtime
 */
function javascript(moduleName, attributesVal) {
    return `import html from './${moduleName}.html'
    export default {
        "html": html,
        "attributes": ${attributesVal || DEFAULT_ATTRIBUTES}
    }`;
}

module.exports = { template, javascript };