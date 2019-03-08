import { getResourceReferenceFromAuraMethod } from 'talon-connect-gen';
import makeRequest from './requests';

export default async function apiCall(endpoint, params) {
    const [controller, action] = endpoint.split(".");

    // handle Apex calls
    if (controller === "ApexActionController") {
        return handleApexAction(action, params);
    }

    // handle UI API calls
    // get the UI API reference using the Aura controller and method name
    const uiApiReference = getResourceReferenceFromAuraMethod(endpoint);
    if (uiApiReference) {
        return handleUiApiCall(uiApiReference, params);
    }

    throw new Error(`Unsupported controller action: ${controller}.${action}`);
}

async function handleUiApiCall({ urlPath, urlPathParamNames, verb: method, inputRepresentation }, params) {
    const remainingParams = (params && { ...params }) || {};

    // replace the path params
    let path = urlPathParamNames.reduce((currentPath, paramName) => {
        const value = remainingParams[paramName];
        delete remainingParams[paramName];
        return currentPath.replace('${' + paramName + '}', encodeURIComponent(value));
    }, urlPath);

    // get the POST/PATCH body
    let body;
    if ((method === 'POST' || method === 'PATCH') && remainingParams[inputRepresentation]) {
        body = remainingParams[inputRepresentation];
        delete remainingParams[inputRepresentation];
    }

    // add the rest as query params
    if (Object.keys(remainingParams).length) {
        path += '?' + Object.entries(remainingParams).map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join('&');
    }

    // fetch!
    return makeRequest({ path, method, body });
}

async function handleApexAction(action, params) {
    if (action === "execute") {
        const { returnValue } = await makeRequest({ path: `/apex/${action}`, method: 'POST', body: params });
        return returnValue;
    }

    throw new Error(`Unsupported Apex action: ${action}`);
}
