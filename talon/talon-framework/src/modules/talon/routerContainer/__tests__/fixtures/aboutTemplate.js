import html from './aboutTemplate.html';
export default {
    "html": html,
    "attributes": (cmp) => ({
        get["attributeWithExpressionValue"]() {
            return cmp.routeParams.recordId;
        },
        "attributeWithStringValue": "Hello"
    })
};