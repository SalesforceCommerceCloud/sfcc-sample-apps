import { generateAttributesJS } from '../attributes-js-generator.js';

const attributeLiterals = [
    null,
    true,
    false,
    -1.5,
    3.14,
    420,
    "",
    "foo",
    'escaped \'single\' quotes',
    "escaped \"double\" quotes",
    "\\",
    {},
    {
        notEvaluated: "{!recordId}"
    },
    {
        a : "b",
        c : {
            d : true
        },
        e : 3.14,
        "f g" : {}
    },
    [],
    [1],
    [1, false, null, "{!ignored}", [], {}, [3.14]],
    "{ !expressionsStartWithCurlyBang }",
    "{! hyphens-not-allowed }",
    "{!}",
    "{!noEndingBrace"
];
const attributeExpressions = [
    "{!recordId}",
    "{!   whitespacePrefixPostfixAllowed   }",
    "{!underscores_are_allowed}",
    "{!periods.are.allowed}",
    "{! 09812309123 }",
    "{! 09_.1enmixed0_.aSS }"
];
const attributeEmbeddedExpressions = [
    "   {!recordId}   ",
    "prefix {!recordId}",
    "{!recordId} postfix",
    "prefix{!recordId}postfix",
    "a{!recordId}b{!userId}c{!recordId}d",
    "{!recordId}{!userId}",
    " \"escaped\" \"{!recordId}\"",
    "{!{!recordId}}",
    "{!{!recor}dId}",
];
const defaultAttributeSet = {
    "xliterals_0": {
        str: "foo",
        bool: true,
    },
    "xexpressions_1": {
        recordId: "{!recordId}",
        userId: "{!myValue}"
    },
    "xmixed_2": {
        literal: "literal",
        exprAttr: "{!retVal}",
        literal2: "literal2",
    },
    "xsingle-expression_3": {
        userId: "{!myValue}"
    },
    "xsingle-literal_4": {
        one: "attribute"
    },
    "xempty_5": {},
    "xembedded-expressions_6": {
        complexAttr: "prefix {!recordId} postfix"
    },
};

// Create a simple single-component attribute set from a list of values
function createAttributeSet(valueList) {
    const cmpNameKey = "xfoo_0";
    const attributeSet = {};
    attributeSet[cmpNameKey] = {};
    for (let i = 0; i < valueList.length; i++) {
        attributeSet[cmpNameKey][i] = valueList[i];
    }
    return attributeSet;
}

describe("attributes-js-generator", () => {
    describe("generateAttributesJS", () => {
        describe("generates the right javascript for", () => {
            it("empty attribute set", () => {
                const generatedJS = generateAttributesJS({});
                expect(generatedJS).toMatchSnapshot();
            });
            it("attribute set with empty component maps", () => {
                const generatedJS = generateAttributesJS({
                    "xempty_1": {},
                    "xempty_2": {},
                    "xempty_3": {},
                });
                expect(generatedJS).toMatchSnapshot();
            });
            it("attribute set with literals", () => {
                const attributeSet = createAttributeSet(attributeLiterals);
                const generatedJS = generateAttributesJS(attributeSet);
                expect(generatedJS).toMatchSnapshot();
            });
            it("attribute set with {!expressions}", () => {
                const attributeSet = createAttributeSet(attributeExpressions);
                const generatedJS = generateAttributesJS(attributeSet);
                expect(generatedJS).toMatchSnapshot();
            });
            it("attribute set with embedded {!expressions}", () => {
                const attributeSet = createAttributeSet(attributeEmbeddedExpressions);
                const generatedJS = generateAttributesJS(attributeSet);
                expect(generatedJS).toMatchSnapshot();
            });
            it("mixed attribute set", () => {
                const generatedJS = generateAttributesJS(defaultAttributeSet);
                expect(generatedJS).toMatchSnapshot();
            });
        });
    });
});