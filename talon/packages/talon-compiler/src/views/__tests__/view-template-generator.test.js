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
                                        name: "x/logo"
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
                            size: "50"
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
            expect(template(defaultView.component, false)).toMatchSnapshot();
        });

        it("generates the right theme layout view html", () => {
            expect(template(defaultView.component, true)).toMatchSnapshot();
        });
    });

    describe("javascript", () => {
        it("generates the right javascript", () => {
            expect(javascript(defaultView.name)).toMatchSnapshot();
        });
    });
});