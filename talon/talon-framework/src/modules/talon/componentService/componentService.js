import { createElement as engineCreateElement } from 'lwc';
import { getComponent } from 'talon/moduleRegistry';
import { moduleSpecifierToElementName } from 'talon-common';
import { getLwcFallback } from 'talon/configProvider';


export async function createElement(name) {
    return new Promise((resolve) => {
        getComponent(name)
            .then(ctor => {
                const customElementName = moduleSpecifierToElementName(name);
                const customElement = engineCreateElement(customElementName, { is: ctor, fallback: getLwcFallback() });
                resolve(customElement);
            });
    });
}

export default { createElement };