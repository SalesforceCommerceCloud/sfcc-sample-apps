const folderHash = jest.fn(() => {
    return Promise.resolve({
        subscribe() {
            return {
                unsubscribe: jest.fn()
            };
        }
    });
});

module.exports = folderHash;