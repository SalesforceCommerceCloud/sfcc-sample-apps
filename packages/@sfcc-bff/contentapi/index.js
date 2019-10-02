'use strict';

var core = require('@sfcc-core/core');
var coreGraphql = require('@sfcc-core/core-graphql');
var apolloServerCore = require('apollo-server-core');
var rp = require('request-promise');

const typeDef = apolloServerCore.gql`
    extend type Query {
        content(contentIds: [String!]): [Content]
    }

    type Content {
        description: String!
        id: String!
        name: String!
        body: String!
    }
`;

class Content {
    constructor(content) {
        this.description = content.description;
        this.id = content.id;
        this.name = content.name;
        this.body = content.c_body;
    }
}

const getContent = (config, contentIds) => {
    const CONTENT_URL = `${config.COMMERCE_BASE_URL}/content/(${contentIds.join()})?client_id=${config.COMMERCE_APP_API_CLIENT_ID}`;
    console.log('---- GETTING CONTENTS FROM API ---- ');
    console.log('---- URL ---- ' + CONTENT_URL);
    return new Promise((resolve, reject) => {
        Promise.all([
            rp.get({
                uri: CONTENT_URL,
                json: true
            })
        ]).then(([contents]) => {
            resolve(contents.data);
        }).catch((err) => {
            reject(err);
        });
    });
};

const resolver = (config) => {
    return {
        Query: {
            content: (_, {contentIds}) => {
                const result = getContent(config, contentIds).then((contents) => {
                    console.log("---- Received Contents from API ----");
                    console.log(contents);
                    console.log("---- Received Contents from API ----");
                    return contents.map((content) => new Content(content));
                });
                return result;
            }
        }
    }
};

// Content

// SFRA Core Extension module

class ContentAPI {
    constructor(core$$1) {
        this.core = core$$1;
        this.core.logger.log('ContentAPI.constructor(core)');
    }

    get typeDefs() {
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        core.core.logger.log('ContentAPI.typeDefs()', typeDef);
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        return [typeDef];
    }

    getResolvers(config) {
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        core.core.logger.log('ContentAPI.getResolvers()', config);
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        return coreGraphql.resolverFactory(config,[resolver]);
    }

    getDataSources(config) {
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        core.core.logger.log('ProductAPI.getDataSources()', config);
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        return coreGraphql.dataSourcesFactory(config, []);
    }

}

core.core.registerExtension(core.API_EXTENSIONS_KEY, function (config) {
    const contentAPI = new ContentAPI(core.core);
    return contentAPI;
});

module.exports = ContentAPI;
