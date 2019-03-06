import { ThemeService } from 'talon/themeService';

let themeService;
const testTheme = {
    themeLayouts: {
        "inner": {
            component: "foo/bar"
        },
        "default": {
            component: "foo/baz"
        },
        "whatever": {
            component: "x/foo"
        }
    }
};
describe('talon/themeService', () => {
    beforeEach(() => {
        // reinstantiate theme service before each test
        themeService = new ThemeService();
    });

    describe("getThemeLayoutByType", () => {
        it("returns the right theme layout type", () => {
            themeService.setTheme(testTheme);
            expect(themeService.getThemeLayoutByType("inner")).toEqual("foo/bar");
            expect(themeService.getThemeLayoutByType("default")).toEqual("foo/baz");
            expect(themeService.getThemeLayoutByType("whatever")).toEqual("x/foo");
        });
    });

    it("throws if no theme layout found", () => {
        themeService.setTheme(testTheme);
        expect(() => {
            themeService.getThemeLayoutByType("blah");
        }).toThrowError(`No theme layout type by the name "blah" found.`);
    });
});