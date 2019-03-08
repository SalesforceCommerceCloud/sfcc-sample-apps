/**
 * Process branding properties when read in from Json file.
 * Applies transformations to any declarative values that need massaging off-core only.
 *
 * Preserves all fields on the property in case they need to be evaluated during HTML generation.
 *
 * @param {Object} brandingProperties branding properties
 */
function getCanonicalBrandingProperty(brandingProperty) {
    // If 'type' is defined, we need to do some transformations for special site.com declarative values
    if (brandingProperty.type && brandingProperty.type === 'Picklist') {
        brandingProperty.value = getPicklistTypeValue(brandingProperty.value);
    }
    return brandingProperty;
}

/**
 * Evaluates a branding property and performs any necessary transformations to the value
 * used in the HTML generation, both on and off core.
 *
 * @param {Map} brandingProperty the branding property that has at least a name and value
 */
function getBrandingPropertyValue(brandingProperty) {
    let normalizedValue = brandingProperty.value;
    // If 'type' is defined, we need to do some transformations for special site.com declarative values
    if (brandingProperty.type && brandingProperty.type === 'Image') {
        normalizedValue = processImageTypeValue(brandingProperty.value);
    }
    return normalizedValue;
}

/**
 * Process a declarative branding property value of type Image.
 * Expects a raw image URL.
 * @param {string} value image branding property value
 */
function processImageTypeValue(value) {
    return `url(${value})`;
}

/**
 * Get the canonical value from a declarative branding property value of type Picklist.
 * Expects a string in the form "labelA:valueA,labelB:valueB:default,labelC:valueC,..."
 * @param {string} value picklist branding property value
 */
function getPicklistTypeValue(value) {
    const allOptions = value.split(',');
    const defaultOptions = allOptions.filter(o => o.match(/:default$/i));
    // Use the default, if one is defined. Otherwise, use the first picklist option.
    const selectedOption = (defaultOptions.length > 0) ? defaultOptions[0] : allOptions[0];
    // Separate the label:value
    return selectedOption.split(':')[1];
}

module.exports = { getCanonicalBrandingProperty, getBrandingPropertyValue };