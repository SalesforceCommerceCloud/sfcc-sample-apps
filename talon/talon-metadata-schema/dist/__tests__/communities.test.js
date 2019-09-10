"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const routes_1 = require("./__fixtures__/routes");
const themes_1 = require("./__fixtures__/themes");
const views_1 = require("./__fixtures__/views");
const validator = new index_1.default("communities");
describe("Routes", () => {
    it("Expects routes to have a label", () => {
        return validator.validate(routes_1.requiredLabels, "declarative-routes").then(() => {
            fail("Expected validator to fail when there are no labels");
        }).catch((err) => {
            expect(err.errors.length).toEqual(2);
            expect(err.errors[0].message).toEqual(`should have required property 'label'`);
            expect(err.errors[1].message).toEqual(`should have required property 'label'`);
        });
    });
});
describe("Theme", () => {
    it("Expects a theme to have a label", () => {
        return validator.validate(themes_1.requiredLabel, "declarative-theme").then(() => {
            fail("Expected validator to fail when the theme has no label");
        }).catch((err) => {
            expect(err.errors.length).toEqual(1);
            expect(err.errors[0].message).toEqual(`should have required property 'label'`);
        });
    });
});
describe("Views", () => {
    it("Expect label to be defined for a view", () => {
        return validator.validate(views_1.requiredLabels, "declarative-view").then(() => {
            fail("Expected validator to fail if the view has no label");
        }).catch((err) => {
            expect(err.errors.length).toEqual(1);
            expect(err.errors[0].message).toEqual(`should have required property 'label'`);
        });
    });
    it("Expect themeLayoutType to be alphanumeric", () => {
        return validator.validate(views_1.alphanumericThemeLayoutType, "declarative-view").then(() => {
            fail("Expected validator to fail if the themeLayoutType to be alphanumeric");
        }).catch((err) => {
            expect(err.errors.length).toEqual(1);
            expect(err.errors[0].message).toContain(`should match pattern`);
        });
    });
});
