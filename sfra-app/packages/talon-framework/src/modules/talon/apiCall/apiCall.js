import { makePostRequest, makeGetRequest } from './requests';

export default function apiCall(controller, options) {
    const endpointParams = controller.split(".");
    const controllerClass = endpointParams[0];
    const action = endpointParams[1];

    Object.assign(options, { controller: controllerClass });

    switch (controllerClass) {
        case "RecordUiController":
            return handleRecordUi(action, options);
        case "ApexActionController":
            return handleApexAction(action, options);
        default:
            return Promise.reject(`Unsupported wire service controller: ${controllerClass}`);
    }
}

function handleRecordUi(action, options) {
    if (action === "getRecordWithFields") {
        return getRecordWithFields(options);
    } else if (action === "getRecordUis") {
        return getRecordUis(options);
    }
    return Promise.reject(`Unsupported ${options.controller} action: ${action}`);
}

function getRecordWithFields(options) {
    const fieldsQs = options.optionalFields.join(",");
    return makeGetRequest(`api/${options.controller}/getRecordsWithFields/${options.recordId}?fields=${fieldsQs}`)
            .then(response => {
                if (response.hasErrors) {
                    return Promise.reject("There are errors");
                }

                return response.results[0].result;
            });
}

function getRecordUis(options) {
    const recordIds = options.recordIds.join(",");
    return makeGetRequest(`api/${options.controller}/getRecordUis/${recordIds}`)
            .catch(error => Promise.reject(error))
            .then(response => Promise.resolve(response));
}

function handleApexAction(action, options) {
    if (action === "execute") {
        return executeApexAction(options);
    }
    return Promise.reject(`Unsupported ${options.controller} action: ${action}`);
}

function executeApexAction(options) {
    return makePostRequest(`api/${options.controller}/execute`, options)
            .catch(error => Promise.reject(error))
            .then(response => response.returnValue);
}