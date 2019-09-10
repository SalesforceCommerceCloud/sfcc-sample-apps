import apiCall from "talon/apiCall";
import { assert } from "talon/utils";

export function getApexInvoker(apexResource) {
    const cacheable = false;
    const apexDefParts = apexResource.replace(/^@salesforce\/apex\//, '').split('.');
    const [classname, methodname] = apexDefParts.splice(-2);
    const namespace = apexDefParts[0] || '';

    assert(classname, `Failed to parse Apex class name for ${apexResource}.`);
    assert(methodname, `Failed to parse Apex method name for ${apexResource}.`);

    return (params) => {
        return apiCall("ApexActionController.execute", { namespace, classname, methodname, params, cacheable });
    };
}

export default { getApexInvoker };