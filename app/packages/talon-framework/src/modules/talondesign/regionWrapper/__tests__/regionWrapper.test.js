import { createElement } from 'lwc';
import RegionWrapper from 'talondesign/regionWrapper';

describe('talondesign/regionWrapper', () => {
    it('renders when islocked is true', async () => {
        const element = createElement('talondesign-region-wrapper', { is: RegionWrapper });

        element.componentId = "blah-blah-blah";
        element.label = "My Label!";
        element.name = "foo";
        element.isLocked = true;
        element.type = "huh";

        document.body.appendChild(element);

        expect(element).toMatchSnapshot();
    });

    it('renders when islocked is false', async () => {
        const element = createElement('talondesign-region-wrapper', { is: RegionWrapper });

        element.componentId = "blah-blah-blah";
        element.label = "My Label!";
        element.name = "foo";
        element.isLocked = false;
        element.type = "huh";

        document.body.appendChild(element);

        expect(element).toMatchSnapshot();
    });
});