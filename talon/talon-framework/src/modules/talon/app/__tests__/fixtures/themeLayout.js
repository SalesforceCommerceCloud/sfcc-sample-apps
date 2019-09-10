import html from './themeLayout.html';
export default {
    "html": html,
    "attributes": (cmp) => ({
        get["attributeWithExpressionValue"]() {
            return cmp.routeParams.recordId;
        },
        "attributeWithStringValue": "Hello"
    })
};