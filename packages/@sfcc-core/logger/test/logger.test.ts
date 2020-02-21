import { Logger, LEVELS } from '../src';
import apilog from 'loglevel';

jest.mock('loglevel');

describe('logger', () => {
    let logger = new Logger(apilog);

    beforeEach(() => {
        logger = new Logger(apilog);
    });

    it('should set logger level', () => {
        logger.setLevel(LEVELS.DEBUG);
        expect(apilog.setLevel).toHaveBeenCalledWith(LEVELS.DEBUG);
    });

    it('should log info', () => {
        logger.info('some information');
        expect(apilog.info).toHaveBeenCalledWith('some information');

        logger.info('some information 2');
        expect(apilog.info).toHaveBeenCalledWith('some information 2');
    });

    it('should log debug', () => {
        logger.debug('some information');
        expect(apilog.debug).toHaveBeenCalledWith('some information');
    });

    it('should log warn', () => {
        logger.warn('some information');
        expect(apilog.warn).toHaveBeenCalledWith('some information');
    });

    it('should log error', () => {
        logger.error('some information');
        expect(apilog.error).toHaveBeenCalledWith('some information');
    });
});
