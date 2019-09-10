import { createElement } from 'lwc';
import DropRegion from 'talondesign/dropRegion';


describe('talondesign/dropRegion', () => {
    it('renders', async () => {
        const element = createElement('talondesign-drop-region', { is: DropRegion });
        document.body.appendChild(element);
        expect(element).toMatchSnapshot();
    });
});