const { moduleSpecifierToElementName } = require('talon-common');

const pretty = require("pretty");

function regions(rs, isThemeLayout) {
    let val = '';
    if (rs && rs.length) {
        rs.forEach(region => {
            if (region.components && region.components.length) {
                region.components.forEach(c => {
                    val += component(c, false, region.name);
                });
            } else {
                val += `<span slot="${region.name}"></span>`;
            }
        });
    }

    if (isThemeLayout) {
        val += `${defaultSlot()}`;
    }

    return val;
}

function defaultSlot() {
    return `<talon-router-container></talon-router-container>`;
}

function attributes(attrs, slotName) {
    let val = '';
    Object.entries(attrs || {}).forEach(entry => {
        val += ` ${entry[0]}="${entry[1]}"`;
    });

    if (slotName) {
        val += ` slot="${slotName}"`;
    }
    return val;
}

function component(c, isThemeLayout, regionName) {
    const attrs = attributes(c.attributes, regionName);
    let val = `<${moduleSpecifierToElementName(c.name)}${attrs}>`;
    val += `${regions(c.regions, isThemeLayout)}`;
    val += `</${moduleSpecifierToElementName(c.name)}>`;
    return val;
}

/**
 * Generate an LWC template for a provided component
 *
 * @param {object*} c - The top level component to render an LWC template for
 * @param {boolean} isThemeLayout - Whether that component is a theme layout or not
 */
function template(c, isThemeLayout) {
    return pretty(`<template>${component(c, isThemeLayout)}</template>`);
}

/**
 * Generates javascript which imports an HTML file and exports the HTML as default
 *
 * @param {string} moduleName - The name of the view, used to specify the import location of the HTML
 */
function javascript(moduleName) {
    return `import html from './${moduleName}.html'
    export default html`;
}

module.exports = { template, javascript };