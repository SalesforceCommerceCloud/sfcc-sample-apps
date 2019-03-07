import { createElement as engineCreateElement } from 'lwc';
import { getModule } from 'talon/moduleRegistry';
import { logError } from 'talon/logger';
import { moduleSpecifierToElementName } from '@sfcc-dev/talon-common';


export async function createElement(name) {
    return new Promise((resolve) => {
        getModule(name)
            .then(ctor => {
                const customElementName = moduleSpecifierToElementName(name);
                const customElement = engineCreateElement(customElementName, { is: ctor });
                resolve(customElement);
            })
            .catch(error => {
                logError(error);
            });
    });
}

export default { createElement };