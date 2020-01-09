/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import * as rp from 'request-promise';
import Content from '../models/Content';

const getContent = (config, contentIds) => {
    const CONTENT_URL = `${config.COMMERCE_BASE_URL}/content/(${contentIds.join()})?client_id=${config.COMMERCE_APP_API_CLIENT_ID}`
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
}

export const resolver = (config) => {
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
}
