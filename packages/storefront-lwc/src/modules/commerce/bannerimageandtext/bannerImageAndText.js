/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

/**
 * Banner with text and image component. Renders banner with text and image content.
 */
class BannerImageAndText extends LightningElement {
    @api bannerTitleL1;
    @api bannerTitleL2;
    @api bannerTitleL3;
    @api bannerText;
    @api bannerImageSrc;
    @api bannerImageAlt;
    @api bannerImageTitle;
    @api bannerLink;
}

export default BannerImageAndText;
