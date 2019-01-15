export const ENTER_KEY = 13;

export function getStartUrlFromCurrentUrl() {
    const keyValuePairs = queryStringToMap(window.location.search.substring(1).replace(/\+/g, ' '));
    return keyValuePairs.startURL || "";
}

function queryStringToMap(queryString) {
    return queryString
    .split("&")
    .map(str => {
        const [key, value] = str.split('=');
        return {[key]: decodeURI(value)};
    })
    .reduce((prev, curr) => Object.assign(prev, curr));
}