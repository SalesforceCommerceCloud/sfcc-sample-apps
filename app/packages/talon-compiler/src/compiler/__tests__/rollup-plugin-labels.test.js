const plugin = require('../rollup-plugin-labels');

jest.mock('../../context/context-service', () => ({
    getContext() {
        return {};
    }
}));

jest.mock('../../metadata/metadata-service', () => ({
    getLabels() {
        return {
            section1: {
                label1: 'Label 1'
            }
        };
    }
}));

const labels = plugin();

describe('rollup-plugin-labels', () => {
    describe('resolveId', () => {
        it('ignores non labels', async () => {
            expect(labels.resolveId('not a label')).toBeNull();
        });
        it('ignores unknown labels', async () => {
            expect(labels.resolveId('@salesforce/label/unknown.label')).toBeNull();
        });
        it('resolves id', async () => {
            expect(labels.resolveId('@salesforce/label/section1.label1'))
                .toBe('@salesforce/label/section1.label1.js');
        });
    });
    describe('load', () => {
        it('ignores non labels', async () => {
            expect(labels.load('not a label')).toBeNull();
        });
        it('ignores unknown labels', async () => {
            expect(labels.load('@salesforce/label/unknown.label')).toBeNull();
        });
        it('loads label', async () => {
            expect(labels.load('@salesforce/label/section1.label1')).toBe('export default "Label 1";');
        });
    });
});

