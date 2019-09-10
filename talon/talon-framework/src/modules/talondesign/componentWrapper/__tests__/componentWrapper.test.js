import { createElement } from 'lwc';
import ComponentWrapper from 'talondesign/componentWrapper';

jest.mock('talon/componentService', () => ({
    async createElement(name) {
        return global.document.createElement(name);
    }
}));

describe('talondesign/componentWrapper', () => {
    it('renders', async () => {
        const element = createElement('talondesign-component-wrapper', { is: ComponentWrapper });
        element.componentId = "blah-blah-blah";
        element.label = "My Label!";
        element.name = "foo";
        element.isLocked = true;

        document.body.appendChild(element);
        expect(element).toMatchSnapshot();
    });
});