import { template, javascript } from '../view-template-generator.js';

const defaultView = {
    name: "defaultView",
    component: {
        name: "x/foo",
        regions: [
            {
                name: "header",
                components: [
                    {
                        name: "x/header",
                        attributes: {
                            label: "Header Label",
                            class: "header"
                        }
                    },
                    {
                        name: "x/leftSide",
                        regions: [
                            {
                                name: "left-side",
                                components: [
                                    {
                                        name: "x/logo",
                                        attributes: {}
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: "customHeader"
            },
            {
                name: "footer",
                components: [
                    {
                        name: "x/footer",
                        attributes: {
                            label: "Label",
                            number: -3.14,
                            recordId: "{!recordId}",
                        }
                    }
                ]
            }
        ]
    }
};

describe("view-template-generator", () => {
    describe("template", () => {
        it("generates the right view html", () => {
            const generatedComponent = template(defaultView.component, false);
            expect(generatedComponent.html).toMatchSnapshot();
        });
        it("generates the right view attributes", () => {
            const generatedComponent = template(defaultView.component, false);
            expect(generatedComponent.attributes).toMatchSnapshot();
        });
        it("generates the right theme layout view html", () => {
            const generatedComponent = template(defaultView.component, true);
            expect(generatedComponent.html).toMatchSnapshot();
        });
        it("generates the right theme layout view attributes", () => {
            const generatedComponent = template(defaultView.component, true);
            expect(generatedComponent.attributes).toMatchSnapshot();
        });

        it("generates the right view html for designtime", () => {
            expect(template(defaultView.component, false, true)).toMatchSnapshot();
        });

        it("generates the right theme layout view html for designtime", () => {
            expect(template(defaultView.component, true, true)).toMatchSnapshot();
        });
    });

    describe("javascript", () => {
        it("generates the right javascript", () => {
            const mockAttributesVal = "MOCK_GENERATED_ATTRIBUTES_JS";
            const generatedJavascript = javascript(defaultView.name, mockAttributesVal);
            expect(generatedJavascript).toMatchSnapshot();
        });
        it("generates the right javascript with no attributes", () => {
            const generatedJavascript = javascript(defaultView.name);
            expect(generatedJavascript).toMatchSnapshot();
        });
    });
});