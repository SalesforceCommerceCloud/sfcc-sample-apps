const { getResourceUrl } = require('talon-common');
const fs = require('fs');
const gzipSize = require('gzip-size');
const path = require('path');
const resources = require('../../dist/resources.json');
const crypto = require('crypto');


describe('framework-resources', () => {
    Object.keys(resources).forEach(descriptor => {
        Object.entries(resources[descriptor]).forEach(([mode, uid]) => {
            const inputFile = path.resolve(__dirname, `../../dist/public${getResourceUrl(descriptor, mode, uid)}`);
            const content = fs.readFileSync(inputFile, 'utf8');
            const hash = crypto.createHash('md5').update(content).digest("hex");

            // write the file to the disk so that we can inspect the diffs using git
            const outputFile = path.resolve(__dirname, `__snapshots__/${descriptor.split('://')[1]}_${mode}.js`);
            fs.writeFileSync(outputFile, content);

            it(`${descriptor}[${mode}] hash`, () => expect(hash).toMatchSnapshot());
            it(`${descriptor}[${mode}] size`, () => expect(content.length).toMatchSnapshot());
            it(`${descriptor}[${mode}] gzipped size`, () => expect(gzipSize.sync(content)).toMatchSnapshot());
        });
    });
});