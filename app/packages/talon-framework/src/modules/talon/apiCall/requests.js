import { getBasePath } from 'talon/configProvider';

/**
 * Makes a request using the fetch API with the given path, method and body.
 *
 * This method takes care of setting the credentials to 'same-origin'
 * and adds the Content-Type header if a body is passed.
 *
 * @param {Object} config - The request config
 * @param {String} config.path - The request path, should be absolute but we prepend /<basePath>/api to it
 * @param {String} config.method - The method
 * @param {String} config.body - The request body as an object, will be stringified
 */
export default async function makeRequest({ path, method, body }) {
    const url = `${getBasePath()}/api${path}`;
    const headers = {};

    if (body) {
        headers['Content-Type'] = 'application/json; charset=utf-8';
    }

    return fetch(url, {
        method,
        credentials: 'same-origin',
        headers,
        body: body && JSON.stringify(body)
    }).then(response => {
        if (!response.ok) {
            throw response.statusText; // eslint-disable-line no-throw-literal
        }

        return response.status !== 204 && response.json();
    });
}