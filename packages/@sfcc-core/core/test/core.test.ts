import { core } from '../src';

describe('core', () => {
    beforeEach(() => {
        core.init();
    });

    it('should register extensions', () => {
        function extension() {}
        expect(core.getExtension('myExtension')).toBeUndefined();
        core.registerExtension('myExtension', extension);
        expect(core.getExtension('myExtension')).toBeDefined();
        expect(core.getExtension('myExtension')).toBeInstanceOf(Array);
        expect(core.getExtension('myExtension')[0]).toBe(extension);
    });

    it('should register services', () => {
        class Service {}
        expect(() => core.getService('myService')).toThrow();
        core.registerService('myService', Service);
        expect(core.getService('myService')).toBeDefined();
        expect(core.getService('myService')).toBeInstanceOf(Service);
    });

    it('should initialize extensions', () => {
        function extension() {
            return 'extension output';
        }
        core.registerExtension('myExtension', extension);
        core.initializeExtensions('myExtension');
        expect(core.getInitializedExtensions('myExtension')[0]).toBe(
            'extension output',
        );
    });
});
