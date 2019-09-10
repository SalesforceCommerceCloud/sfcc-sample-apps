function isRenderDesignTime() {
    return process.env.RENDER === 'DESIGNTIME';
}

module.exports = {
    isRenderDesignTime
};