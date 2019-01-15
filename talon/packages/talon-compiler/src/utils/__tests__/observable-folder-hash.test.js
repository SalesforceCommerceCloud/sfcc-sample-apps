import folderHash from '../observable-folder-hash';
import chokidar from 'chokidar';

jest.mock('chokidar', () => {
    const callbacks = [];
    return {
        watch() {
            return {
                on(type, callback) {
                    callbacks.push(callback);
                }
            };
        },
        trigger() {
            return Promise.all(callbacks.map(callback => {
                return callback();
            }));
        }
    };
});

jest.mock('folder-hash', () => {
    const hashElement = jest.fn(() => {
        return Promise.resolve({
            hash: `#${hashElement.mock.calls.length}`
        });
    });
    return { hashElement };
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('observable-folder-hash', () => {
    describe('folderHash', () => {
        it('returns hash', () => {
            const next = jest.fn();
            return folderHash('some folder')
                .then(observable => {
                    return new Promise(resolve => {
                        next.mockImplementation(resolve);
                        observable.subscribe({ next });
                    });
                })
                .then(() => {
                    expect(next.mock.calls).toHaveLength(1);
                    expect(next.mock.calls[0][0]).toBe('#1');
                })
                .then(async () => {
                    await chokidar.trigger();
                    expect(next.mock.calls).toHaveLength(2);
                    expect(next.mock.calls[1][0]).toBe('#2');
                })
                .then(async () => {
                    await chokidar.trigger();
                    expect(next.mock.calls).toHaveLength(3);
                    expect(next.mock.calls[2][0]).toBe('#3');
                });
        });
    });
});