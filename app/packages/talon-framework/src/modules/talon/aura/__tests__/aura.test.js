import { executeGlobalController, createComponent } from "talon/aura";
import { log } from "talon/logger";
import apiCall from 'talon/apiCall';

jest.mock('talon/apiCall');
jest.mock('talon-connect-gen', () => ({}), { virtual: true });
jest.mock('talon/logger', () => {
    return {
        log: jest.fn()
    };
});

describe('talon/aura', () => {
    describe('createComponent', () => {
        it('fails with unsupported wire service', () => {
            const name = 'someComponent';
            const attributes = {name: 'someName', value: 'someValue'};
            createComponent(name, attributes);
            expect(log).toHaveBeenCalledWith(`[aura] createComponent(${JSON.stringify({ name, attributes })})`);
        });
    });
    describe('executeGlobalController', () => {
        it('is apiCall', () => {
            return expect(executeGlobalController).toBe(apiCall);
        });
    });
});