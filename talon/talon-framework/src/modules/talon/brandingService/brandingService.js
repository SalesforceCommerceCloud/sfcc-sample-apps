let brandingProperties = {};

export function style(customProperty, defaultValue) {
    const val = (brandingProperties.hasOwnProperty(customProperty) && brandingProperties[customProperty]) || defaultValue;
    if (!val) {
        return `var(${customProperty}${defaultValue ? ', ' + defaultValue : ''})`;
    }
    return val;
}

export function setBrandingProperties(props) {
   brandingProperties = props;
}

export default { setBrandingProperties, style };