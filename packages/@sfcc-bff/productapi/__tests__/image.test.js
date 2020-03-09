import { Image } from '../src/api/models/Image';

describe('core', () => {
    beforeEach(() => {

    });

    it('should register extensions', () => {
        // function extension() {}

        expect(core.getExtension('myExtension')).toBeUndefined();
        // core.registerExtension('myExtension', extension);
        // expect(core.getExtension('myExtension')).toBeDefined();
        // expect(core.getExtension('myExtension')).toBeInstanceOf(Array);
        // expect(core.getExtension('myExtension')[0]).toBe(extension);
    });

});
