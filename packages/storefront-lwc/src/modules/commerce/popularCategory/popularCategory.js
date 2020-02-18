/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

/**
 * Popular Category component. Renders popular category content.
 */
class PopularCategory extends LightningElement {
    @api categoryName;
    @api categoryLink;
    @api categoryImageSrc;
}

export default PopularCategory;
