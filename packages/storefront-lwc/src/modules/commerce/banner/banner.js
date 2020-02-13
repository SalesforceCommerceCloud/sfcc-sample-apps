/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

/**
 * Banner component. Renders banner content.
 */
class Banner extends LightningElement {
    @api bannerTitle;
    @api bannerText;
    @api bannerLink;
    @api bannerImageSrc;
    @api bannerImageAlt;
    @api bannerImageTitle;
}

export default Banner;
