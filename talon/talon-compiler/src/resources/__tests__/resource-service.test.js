import { ResourceService } from '../resource-service';
import { resourceDescriptorToString } from 'talon-common';
import ComponentResourceHandler from '../component-resource-handler';
import FrameworkResourceHandler from '../framework-resource-handler';
import ViewResourceHandler from '../view-resource-handler';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('resource-service get', () => {
    const resourceService = new ResourceService();

    describe('component', () => {
        it('invokes ComponentResourceHandler', async () => {
            // arrange
            const getSpy = jest.spyOn(ComponentResourceHandler.prototype, 'get')
                    .mockImplementation(() => {
                        return new Promise((resolve) => {
                            resolve();
                        });
                    });
            const descriptor = resourceDescriptorToString({
                type: 'component',
                name: 'someCmp',
                locale: 'sv_SE',
            });
            // act
            await resourceService.get(descriptor);
            // assert (verify that get was called once, with descriptor and optional = false)
            expect(getSpy).toHaveBeenCalledTimes(1);
            expect(getSpy.mock.calls[0][0]).toBe(descriptor);
            expect(getSpy.mock.calls[0][1]).toBe(false);
        });
    });
    describe('framework', () => {
        it('invokes FrameworkResourceHandler', async () => {
            const getSpy = jest.spyOn(FrameworkResourceHandler.prototype, 'get')
                    .mockImplementation(() => {
                        return new Promise((resolve) => {
                            resolve();
                        });
                    });
            const descriptor = resourceDescriptorToString({
                type: 'framework',
                name: 'talon',
                locale: 'sv_SE',
            });
            await resourceService.get(descriptor);
            expect(getSpy).toHaveBeenCalledTimes(1);
            expect(getSpy.mock.calls[0][0]).toBe(descriptor);
            expect(getSpy.mock.calls[0][1]).toBe(false);
        });
    });
    describe('view', () => {
        it('invokes ViewResourceHandler', async () => {
            const getSpy = jest.spyOn(ViewResourceHandler.prototype, 'get')
                    .mockImplementation(() => {
                        return new Promise((resolve) => {
                            resolve();
                        });
                    });
            const descriptor = resourceDescriptorToString({
                type: 'view',
                name: 'someview',
                locale: 'sv_SE',
            });
            await resourceService.get(descriptor);
            expect(getSpy).toHaveBeenCalledTimes(1);
            expect(getSpy.mock.calls[0][0]).toBe(descriptor);
            expect(getSpy.mock.calls[0][1]).toBe(false);
        });
    });
});