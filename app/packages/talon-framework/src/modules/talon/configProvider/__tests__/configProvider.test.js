import { register, getBasePath, getMode, getLocale, getLocalizationService, getPathPrefix, getToken, getFormFactor } from "talon/configProvider";
import localizationService from 'talon/localizationService';

jest.mock('talon/localizationService');
jest.mock('talon/utils');

register({
    getBasePath: () => 'basePath',
    getMode: () => 'mode',
    getLocale: () => 'locale'
});

describe('talon/configProvider', () => {
    describe('register', () => {
        it('throws when registering twice', () => {
            expect(() => {
                register({});
            }).toThrow('ConfigProvider can only be set once at initilization time');
        });
    });
    describe('getBasePath', () => {
        it('delegates to provider impl', () => {
            expect(getBasePath()).toBe('basePath');
        });
    });
    describe('getPathPrefix', () => {
        it('delegates to provider impl', () => {
            expect(getPathPrefix()).toBe('basePath');
        });
    });
    describe('getMode', () => {
        it('delegates to provider impl', () => {
            expect(getMode()).toBe('mode');
        });
    });
    describe('getLocale', () => {
        it('delegates to provider impl', () => {
            expect(getLocale().langLocale).toBe('locale');
        });
    });
    describe('getLocalizationService', () => {
        it('returns talon/localizationService', () => {
            expect(getLocalizationService()).toBe(localizationService);
        });
    });
    describe('getToken', () => {
        it('return null', () => {
            expect(getToken()).toBeNull();
        });
    });
    describe('getFormFactor', () => {
        it('return DESKTOP', () => {
            expect(getFormFactor()).toBe('DESKTOP');
        });
    });
});