import localizationService from 'talon/localizationService';
import { getQueryStringParameterByName } from "talon/utils";

/**
 * This pattern is used to configure the framework (base path, etc...)
 * from the HTML file, the provider implementation being typically
 * generated from the template metadata.
 */
let configProvider;

export function register(providerImpl) {
    if (!configProvider) {
        configProvider = providerImpl;
    } else {
        throw new Error('ConfigProvider can only be set once at initilization time');
    }
}

export function getBasePath() {
    return (configProvider && configProvider.getBasePath()) || '';
}

export function getMode() {
    return configProvider && configProvider.getMode();
}

export function getLwcFallback() {
    const lwcFallback = getQueryStringParameterByName('talon.lwc.fallback');
    return lwcFallback && lwcFallback.toLowerCase().trim() === 'false' ? false : true;
}

export function getLocale() {
    const langLocale = (configProvider && configProvider.getLocale()) || '';
    const [language, country = ''] = langLocale.split('_');
    const lang = langLocale.replace('_', '-');

    return {
        "userLocaleLang": "en",
        "userLocaleCountry": "US",
        language,
        country,
        "variant": "",
        langLocale,
        "nameOfMonths": [
            {
                "fullName": "January",
                "shortName": "Jan"
            },
            {
                "fullName": "February",
                "shortName": "Feb"
            },
            {
                "fullName": "March",
                "shortName": "Mar"
            },
            {
                "fullName": "April",
                "shortName": "Apr"
            },
            {
                "fullName": "May",
                "shortName": "May"
            },
            {
                "fullName": "June",
                "shortName": "Jun"
            },
            {
                "fullName": "July",
                "shortName": "Jul"
            },
            {
                "fullName": "August",
                "shortName": "Aug"
            },
            {
                "fullName": "September",
                "shortName": "Sep"
            },
            {
                "fullName": "October",
                "shortName": "Oct"
            },
            {
                "fullName": "November",
                "shortName": "Nov"
            },
            {
                "fullName": "December",
                "shortName": "Dec"
            },
            {
                "fullName": "",
                "shortName": ""
            }
        ],
        "nameOfWeekdays": [
            {
                "fullName": "Sunday",
                "shortName": "SUN"
            },
            {
                "fullName": "Monday",
                "shortName": "MON"
            },
            {
                "fullName": "Tuesday",
                "shortName": "TUE"
            },
            {
                "fullName": "Wednesday",
                "shortName": "WED"
            },
            {
                "fullName": "Thursday",
                "shortName": "THU"
            },
            {
                "fullName": "Friday",
                "shortName": "FRI"
            },
            {
                "fullName": "Saturday",
                "shortName": "SAT"
            }
        ],
        "labelForToday": "Today",
        "firstDayOfWeek": 1,
        "timezone": "America/Los_Angeles",
        "dateFormat": "MMM d, yyyy",
        "shortDateFormat": "M/d/yyyy",
        "longDateFormat": "MMMM d, yyyy",
        "datetimeFormat": "MMM d, yyyy h:mm:ss a",
        "shortDatetimeFormat": "M/d/yyyy h:mm a",
        "timeFormat": "h:mm:ss a",
        "shortTimeFormat": "h:mm a",
        "numberFormat": "#,##0.###",
        "decimal": ".",
        "grouping": ",",
        "zero": "0",
        "percentFormat": "#,##0%",
        "currencyFormat": "¤#,##0.00;(¤#,##0.00)",
        "currencyCode": "USD",
        "currency": "$",
        "dir": "ltr",
        lang,
        "isEasternNameStyle": false
    };
}

export function getLocalizationService() {
    return localizationService;
}

export function getPathPrefix() {
    return getBasePath();
}

export function getToken() {
    return null;
}

export function getUser() {
    return configProvider && configProvider.getUser();
}

export function getFormFactor() {
    // TODO issue #216
    return 'DESKTOP';
}

export function getIconSvgTemplates() {
    return configProvider && configProvider.iconSvgTemplates;
}