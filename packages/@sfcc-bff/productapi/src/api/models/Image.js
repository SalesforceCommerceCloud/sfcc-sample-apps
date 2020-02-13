/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';

class Image {
    constructor(image) {
        this.title = image.title;
        this.alt = image.alt;
        this.link = image.disBaseLink || image.link;
        this.style = `background: url(${this.link});`;
    }
}
export default Image;
