const beautify = require('js-beautify');
const ROUTE_PARAM_REFERENCE = "routeParams";
const CMP_REFERENCE = "cmp";
const EXPRESSION_REGEX_INNER_CAPTURE = /\{!\s*([a-zA-Z0-9_.]+)\s*\}/;

const DEFAULT_ATTRIBUTES = '(cmp) => ({})';

/**
 * Generates the Javascript for the function that takes a component and returns the attribute set
 * with resolved references to route parameters.
 * e.g. (cmp) => ( { ...attributeSet... } )
 *
 * @param {Object} attributeSet the aggregated component attributes for a view
 */
function generateAttributesJS(attributeSet) {
    const attributeSetString = attributeSetToJS(attributeSet);
    return `(${CMP_REFERENCE}) => (${beautify(attributeSetString)})`;
}

/**
 * Converts the attribute set of a view to Javascript.
 *
 * @param {Object} attributeSet the aggregated component attributes for a view
 */
function attributeSetToJS(attributeSet) {
    let attributeSetString = '{';
    let cmpIdx = 0;
    Object.entries(attributeSet).forEach(([cmpNameKey, cmpAttributes]) => {
        // Exclude empty component attribute maps
        if (Object.keys(cmpAttributes).length === 0) {
            return;
        }
        if (cmpIdx++ > 0) {
            attributeSetString += ',';
        }
        attributeSetString += `"${cmpNameKey}": {`;
        let attrIdx = 0;
        Object.entries(cmpAttributes).forEach(([attributeName, attributeValue]) => {
            if (attrIdx++ > 0) {
                attributeSetString += ',';
            }
            attributeSetString += `"${attributeName}":${attributeValueToJS(attributeValue)}`;
        });
        attributeSetString += `}`;
    });
    attributeSetString += '}';
    return attributeSetString;
}

/**
 * Convert an attribute value to Javascript.
 * The value is resolved as necessary in the Javascript.
 *
 * @param {*} attributeValue value of the attribute
 */
function attributeValueToJS(attributeValue) {
    if (typeof attributeValue === "string" && attributeValue.match(EXPRESSION_REGEX_INNER_CAPTURE)) {
        // Resolve any {!EL}
        return resolveStringAttribute(attributeValue);
    }
    return JSON.stringify(attributeValue);
}

/**
 * Evaluates if a string attribute contains any {!expression} and replaces any instances with a reference to route param(s).
 * If the param is not present, the value defaults to an empty string.
 * e.g. "prefix {!recordId} postfix" => "prefix " + (cmp.routeParams["recordId"] || '') + " postfix"
 *
 * Note: This assumes that values from cmp.routeParams will always evaluate to strings (and never numbers).
 *
 * @param {string} attributeValue string attribute value containing an {!expression}
 */
function resolveStringAttribute(attributeValue) {
    let remainderOfString = attributeValue;
    let match = EXPRESSION_REGEX_INNER_CAPTURE.exec(remainderOfString);
    const segments = [];
    while (match) {
        const prefix = remainderOfString.substring(0, match.index);
        if (prefix) {
            segments.push(JSON.stringify(prefix));
        }
        const exprKey = match[1].trim(); // capture group, e.g. "recordId" from "{! recordId }"
        // Default to empty string if route param not present
        const routeParamRef = `(${CMP_REFERENCE}.${ROUTE_PARAM_REFERENCE}["${exprKey}"] || '')`;
        segments.push(routeParamRef);
        // Check for more matches
        remainderOfString = remainderOfString.substring(match.index + match[0].length);
        match = EXPRESSION_REGEX_INNER_CAPTURE.exec(remainderOfString);
    }
    if (remainderOfString) {
        segments.push(JSON.stringify(remainderOfString));
    }
    return segments.join(' + ');
}

module.exports = { generateAttributesJS, DEFAULT_ATTRIBUTES };