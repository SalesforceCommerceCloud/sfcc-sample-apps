const { assert } = require('./utils/assert');
const { getContext } = require('./context/context-service');
const { getResourceUrl, parseUrl, resourceDescriptorToString, RESOURCE_TYPES } = require('talon-common');
const { log } = require('./utils/log');
const { stripPrefix } = require('./utils/string');
const resourceService = require('./resources/resource-service');

/**
 * Handles component resource requests, redirecting the browser
 * to the latest/current version if the UID is not specified.
 *
 * @returns The Express middleware handling component requests redirection
 */
function resourceMiddleware() {
    return async (req, res, next) => {
        const { basePath } = getContext();
        const path = stripPrefix(req.originalUrl.split("?")[0], basePath);
        const { type, name, uid, locale, mode } = parseUrl(path);

        const validType = Object.values(RESOURCE_TYPES).includes(type);

        // compile component and redirect if needed
        if (validType && !uid) {
            const descriptor = resourceDescriptorToString({ type, name, locale });
            return resourceService.get(descriptor)
                .then(staticResource => {
                    const newUid = staticResource.uids[mode];
                    assert(newUid, `Cannot find UID for resource ${descriptor} in mode ${mode}`);
                    const url = basePath + getResourceUrl(descriptor, mode, newUid);
                    res.redirect(url);
                }).catch(err => {
                    log(err);

                    if (res.headersSent) {
                        return next(err);
                    }

                    return res.status(500).send((err && err.stack) || err);
                });
        }

        return next();
    };
}

module.exports = { resourceMiddleware };