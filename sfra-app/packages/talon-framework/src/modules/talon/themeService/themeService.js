import { autoBind } from "talon/utils";

export class ThemeService {
    theme;
    viewToThemeLayoutMap;

    /**
     *
     * @param {Object} theme - The application's main theme
     */
    setTheme(theme) {
        this.theme = theme;
    }

    /**
     * Get a theme layout component by type
     *
     * @param {String} type - The theme layout type to get
     */
    getThemeLayoutByType(type) {
        if (!this.theme.themeLayouts.hasOwnProperty(type)) {
            throw new Error(`No theme layout type by the name "${type}" found.`);
        }
        const themeLayout = this.theme.themeLayouts[type];
        return themeLayout.component || themeLayout.view;
    }

    /**
     * Get a theme layout by its view
     */
    getThemeLayoutByView(view) {
        if (!this.viewToThemeLayoutMap.hasOwnProperty(view)) {
            throw new Error(`No theme layout matching the "${view}" view.`);
        }
        return this.viewToThemeLayoutMap[view];
    }

    /**
     * Sets the view to theme layout map
     * @param {*} map - The map
     */
    setViewToThemeLayoutMap(map) {
        this.viewToThemeLayoutMap = map;
    }
}

// create an instance with bound methods so that they can be exported
const instance = autoBind(new ThemeService());

export const { setTheme, getThemeLayoutByType, setViewToThemeLayoutMap, getThemeLayoutByView } = instance;

export default { setTheme, getThemeLayoutByType, setViewToThemeLayoutMap, getThemeLayoutByView };