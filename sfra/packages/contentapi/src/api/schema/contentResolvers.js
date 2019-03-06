import * as rp from 'request-promise';
import Content from '../models/Content';

const getContent = (config, contentIds) => {
    const CONTENT_URL = `${config.BASE_URL}/content/(${contentIds.join()})?client_id=${config.APP_API_CLIENT_ID}`
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