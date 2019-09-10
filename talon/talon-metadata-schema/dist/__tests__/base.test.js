"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const routes_1 = require("./__fixtures__/routes");
const themes_1 = require("./__fixtures__/themes");
const views_1 = require("./__fixtures__/views");
const validator = new index_1.default("base");
describe("Routes", () => {
    it("Additional route properties are ignored", () => {
        return expect(validator.validate(routes_1.additionalProperties, "routes")).resolves.toEqual("✔️ Validated routes");
    });
    it("Expects a miniumum of two routes to be defined", () => {
        return validator.validate(routes_1.minimumTwoRoutes, "routes").then(() => {
            fail();
        }).catch((err) => {
            expect(err.errors.length).toEqual(1);
            expect(err.errors[0].message).toEqual("should NOT have fewer than 2 items");
        });
    });
    it("Expects an alphanumeric route name", () => {
        return validator.validate(routes_1.invalidRouteNames, "routes").then(() => {
            fail("Expected validator to fail when the route name is not alphanumeric");
        }).catch((err) => {
            expect(err.errors.length).toEqual(3);
            expect(err.errors[0].message).toEqual(`should match pattern "^[A-Za-z0-9_-]+$"`);
            expect(err.errors[1].message).toEqual(`should match pattern "^[A-Za-z0-9_-]+$"`);
            expect(err.errors[2].message).toEqual(`should match pattern "^[A-Za-z0-9_-]+$"`);
        });
    });
    it("Expects that name, path and view are required route properties", () => {
        return validator.validate(routes_1.requiredProperties, "routes").then(() => {
            fail("Expected validator to fail when the route name, path or view is not provided");
        }).catch((err) => {
            expect(err.errors.length).toEqual(3);
            expect(err.errors[0].message).toEqual(`should have required property 'name'`);
            expect(err.errors[1].message).toEqual(`should have required property 'path'`);
            expect(err.errors[2].message).toEqual(`should have required property 'view'`);
        });
    });
});
describe("Theme", () => {
    it("At least one theme layout is required", () => {
        return validator.validate(themes_1.requiredThemeLayout, "theme").then(() => {
            fail("Expected validator to fail when there are no theme layouts");
        }).catch((err) => {
            expect(err.errors.length).toEqual(1);
            expect(err.errors[0].message).toEqual("should NOT have fewer than 1 properties");
            expect(err.errors[0].dataPath).toEqual(".themeLayouts");
        });
    });
    it("Expects that branding, name and themeLayouts are required theme properties", () => {
        return validator.validate(themes_1.noBrandingProperty, "theme").then(() => {
            fail("Expected validator to fail when the branding, themeLayouts or name is not provided");
        }).catch((err) => {
            expect(err.errors.length).toEqual(3);
            expect(err.errors[0].message).toEqual(`should have required property 'name'`);
            expect(err.errors[1].message).toEqual(`should have required property 'branding'`);
            expect(err.errors[2].message).toEqual(`should have required property 'themeLayouts'`);
        });
    });
    it("Expects name to be alphanumeric", () => {
        return validator.validate(themes_1.alphaNumericName, "theme").then(() => {
            fail("Expected validator to fail when the theme name is not alphanumeric");
        }).catch((err) => {
            expect(err.errors.length).toEqual(1);
        });
    });
    it("Expects branding to be a valid URI", () => {
        return validator.validate(themes_1.invalidBrandingUri, "theme").then(() => {
            fail("Expected validator to fail when the branding reference is not a valid URI");
        }).catch((err) => {
            expect(err.errors.length).toEqual(1);
            expect(err.errors[0].message).toEqual(`should match format "uri-reference"`);
        });
    });
});
describe("View", () => {
    it("Expects component name to be a valid LWC component", () => {
        return validator.validate(views_1.invalidLWCComponentName, "view").then(() => {
            fail("Expected validator to fail when the component name is not a valid LWC name");
        }).catch((err) => {
            expect(err.errors.length).toEqual(1);
            expect(err.errors[0].message).toContain("should match pattern");
            expect(err.errors[0].dataPath).toEqual('.component.name');
        });
    });
    it("Expects view template name to be be alphanumeric", () => {
        return validator.validate(views_1.alphaNumericName, "view").then(() => {
            fail("Expected validator to fail when the view name is not alphanumeric");
        }).catch((err) => {
            expect(err.errors.length).toEqual(1);
            expect(err.errors[0].message).toContain("should match pattern");
            expect(err.errors[0].dataPath).toEqual('.name');
        });
    });
    it("Expects view template region name to be be alphanumeric", () => {
        return validator.validate(views_1.invalidTemplateRegionName, "view").then(() => {
            fail("Expected validator to fail when the top-level component region name is not alphanumeric");
        }).catch((err) => {
            expect(err.errors.length).toEqual(1);
            expect(err.errors[0].message).toContain("should match pattern");
            expect(err.errors[0].dataPath).toEqual('.component.regions[0].name');
        });
    });
    it("Expects nested component region names to be alphanumeric", () => {
        return validator.validate(views_1.invalidNestedRegionName, "view").then(() => {
            fail("Expected validator to fail when a nested region name is not alphanumeric");
        }).catch((err) => {
            expect(err.errors.length).toEqual(1);
            expect(err.errors[0].message).toContain("should match pattern");
            expect(err.errors[0].dataPath).toEqual('.component.regions[0].components[0].regions[0].name');
        });
    });
    it("Expects that name and component are required view properties", () => {
        return validator.validate(views_1.requiredProperties, "view").then(() => {
            fail("Expected validator to fail when no name or component provided");
        }).catch((err) => {
            expect(err.errors.length).toEqual(2);
            expect(err.errors[0].message).toEqual(`should have required property 'name'`);
            expect(err.errors[1].message).toEqual(`should have required property 'component'`);
        });
    });
    it("Expects that the top level component name is required", () => {
        return validator.validate(views_1.requiredTopLevelComponentName, "view").then(() => {
            fail("Expected validator to fail when there is no top level component name");
        }).catch((err) => {
            expect(err.errors.length).toEqual(1);
            expect(err.errors[0].message).toEqual(`should have required property 'name'`);
        });
    });
    it("Expects that region components are not required", () => {
        return expect(validator.validate(views_1.notRequiredRegionComponents, "view")).resolves.toEqual("✔️ Validated view");
    });
});
