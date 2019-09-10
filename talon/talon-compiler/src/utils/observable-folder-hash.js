const chokidar = require('chokidar');
const { hashElement } = require('folder-hash');

const options = {
    algo: 'md5',
    encoding: 'hex'
};

async function doHash(target) {
    return (await hashElement(target, options)).hash;
}

/**
 * Gets a folder hash as an observable.
 *
 * @param {string} target The directory to compute the version key for
 * @returns An observable that will notify observers when the folder hash changes
 */
async function folderHash(target) {
    const hash = await doHash(target);
    return {
        subscribe(observer) {
            observer.next(hash);

            const watcher = chokidar.watch(target).on('change', async () => {
                const newHash = await doHash(target);
                observer.next(newHash);
            });

            return {
                unsubscribe: () => {
                    watcher.close();
                }
            };
        }
    };
}

module.exports = folderHash;