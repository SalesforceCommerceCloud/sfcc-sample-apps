// The following syntax should work, but doesn't
// import {core} from '@sfcc-dev/core';
// import {API_CONFIG_KEY} from "@sfcc-dev/apiconfig";
// import redis from 'redis';
// import promisify from 'util';
// export const CORE_REDIS_KEY = Symbol('Core Redis');

// using this old fashioned way of importing module
const core = require('@sfcc-dev/core').core;
const API_CONFIG_KEY = require('@sfcc-dev/apiconfig').API_CONFIG_KEY;
const redis = require('redis');
const promisify = require('util').promisify;

const CORE_REDIS_KEY = Symbol('Core Redis');
exports.CORE_REDIS_KEY = CORE_REDIS_KEY;

/**
 * Core Redis
 */
class CoreRedis {
    constructor(core) {
        core.logger.log('CoreRedis.constructor(core)');
    }

    start() {
        console.log("starting redis");
        const apiConfig = core.getService(API_CONFIG_KEY).config;
        const redis_url = apiConfig.REDIS_URL;
        if (redis_url) {
            try {
                const client = redis.createClient(redis_url);

                client.on('error', (err) => {
                    console.log("Redis Error " + err);
                    // stop client from retrying, and the system will be in no-redis mode
                    client.quit();
                });

                client.on('connect', function () {
                    console.log('Redis connected', redis_url);
                });

                this.promise = promisify(client.get).bind(client);
                this.client = client;
            } catch (e) {
                console.log('Redis cannot be configured, system will not be using redis', e);
            }
        }
    }

    set promise(promise) {
        this._promise = promise;
    }

    get promise() {
        return this._promise;
    }

    set client(client) {
        this._client = client;
    }

    get client() {
        return this._client;
    }
}

core.registerService(CORE_REDIS_KEY, function () {
    return new CoreRedis(core);
});
