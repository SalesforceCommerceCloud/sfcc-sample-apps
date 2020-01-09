/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
'use strict';

class Content {
    constructor(content) {
        this.description = content.description;
        this.id = content.id;
        this.name = content.name;
        this.body = content.c_body;
    }
}
export default Content;