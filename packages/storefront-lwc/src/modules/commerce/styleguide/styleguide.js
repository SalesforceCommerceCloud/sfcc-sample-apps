/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement } from 'lwc'

/**
 * StyleGuide  component. Renders StyleGuide  content.
 */
class StyleGuide extends LightningElement {

    constructor() {
        super();
    }

    renderedCallback() {
        const code = `
        // --------------------------------------------
        // Sample App: Functions, Mixins and Variables
        // --------------------------------------------
        
        // Translated this
        // https://salesforce.invisionapp.com/share/GHU820P6QUP#/screens/387062219_Font
        
        $base-font-size: 14px !default;
        
        $light-gray: #999 !default;
        $medium-gray: #444 !default;
        $dark-gray: #222 !default;
        $white: #fff !default;
        
        $mobile-base: 0.875rem !default;
        $tablet-base: 1.0rem !default;
        $desktop-base: 1.125rem !default;
        
        $font-weight-heavy: 900 !default;
        $font-weight-bold: 600 !default;
        $font-weight-normal: 400 !default;
        
        $breakpoint-mobile-max: 768px;
        $breakpoint-tablet-min: 768px;
        $breakpoint-desktop-min: 992px;
        
        @mixin mobile {
          @media (max-width: $breakpoint-mobile-max) { @content; }
        }
        @mixin tablet {
          @media (min-width: $breakpoint-tablet-min) { @content; }
        }
        @mixin desktop {
          @media (min-width: $breakpoint-desktop-min) { @content; }
        }
        
        @mixin heavy { font-weight: $font-weight-heavy; }
        @mixin bold { font-weight: $font-weight-bold; }
        @mixin normal { font-weight: $font-weight-normal; }
        
        // e.g. Main banner title
        @mixin heading-1 {
          color: $white;
          @include heavy;
          @include mobile { font-size: 2.5 * $mobile-base; text-align: center; }
          @include tablet { font-size: 4 * $tablet-base; text-align: left;}
          @include desktop { font-size: 4 * $desktop-base; text-align: left;}
        }
        
        // e.g. Campaign banner title
        @mixin heading-2 {
            color: $dark-gray;
            @include heavy;
            @include mobile { font-size: 2 * $mobile-base; text-align: center; }
            @include tablet { font-size: 3 * $tablet-base; text-align: left;}
            @include desktop { font-size: 3 * $desktop-base; text-align: left}
        }
        
        // e.g. section title (center) , pdp product name/price (text-align:left)
        @mixin heading-3 {
          color: $dark-gray;
          @include heavy;
          @include mobile { font-size: 1.5 * $mobile-base; text-align: center; }
          @include tablet { font-size: 1.67 * $tablet-base; text-align: center;}
          @include desktop { font-size: 1.67 * $desktop-base; text-align: center;}
        }
        
        // e.g. navigation catalog, breadcrumb title
        @mixin heading-4 {
          color: $dark-gray;
          @include bold;
          @include mobile { font-size: 1.3 * $mobile-base; text-align: center; }
          @include tablet { font-size: 1.5 * $tablet-base; text-align: left;}
          @include desktop { font-size: 1.5 * $desktop-base; text-align: left;}
        }
        
        // e.g Search section title
        @mixin heading-5 {
          color: $dark-gray;
          @include bold;
          @include mobile { font-size: $mobile-base; text-align: left; }
          @include tablet { font-size: $tablet-base; text-align: left;}
          @include desktop { font-size: $desktop-base; text-align: left;}
        }
        
        // e.g. Product tiles product price small
        @mixin heading-6 {
          color: $dark-gray;
          @include bold;
          @include mobile { font-size: 0.8 * $mobile-base; text-align: left; }
          @include tablet { font-size: 0.8 * $tablet-base; text-align: left;}
          @include desktop { font-size: 0.8 * $desktop-base; text-align: left;}
        }
        
        @mixin primary-call-to-action {
          color: $dark-gray;
          @include bold;
          @include mobile { font-size: $mobile-base; text-align: center; }
          @include tablet { font-size: $tablet-base; text-align: center;}
          @include desktop { font-size: $desktop-base; text-align: center;}
        
        }
        
        @mixin large-paragraph {
          color: $medium-gray;
          @include normal;
          @include mobile { font-size: 1.5 * $mobile-base; text-align: left; }
          @include tablet { font-size: 1.67 * $tablet-base; text-align: left;}
          @include desktop { font-size: 1.67 * $desktop-base; text-align: left;}
        }
        
        // Paragraph Normal
        @mixin normal-paragraph {
          color: $medium-gray;
          @include normal;
          @include mobile { font-size: $mobile-base; text-align: left; }
          @include tablet { font-size: $tablet-base; text-align: left;}
          @include desktop { font-size: $desktop-base; text-align: left;}
        }
        
        // Paragraph Small  (e.g. navigation category)
        @mixin small-paragraph {
          color: $medium-gray;
          @include normal;
          @include mobile { font-size: 0.8 * $mobile-base; text-align: left; }
          @include tablet { font-size: 0.8 * $tablet-base; text-align: left;}
          @include desktop { font-size: 0.8 * $desktop-base; text-align: left;}
        }
        
        // e.g. Links under image
        @mixin caption {
          color: $medium-gray;
          text-decoration: underline;
          @include normal;
          @include mobile { font-size: $mobile-base; text-align: center; }
          @include tablet { font-size: $tablet-base; text-align: center;}
          @include desktop { font-size: $desktop-base; text-align: center;}
        }
        
        // e.g. Product Detail Size Chart
        @mixin small-link {
          color: $medium-gray;
          text-decoration: underline;
          @include normal;
          @include mobile { font-size: 0.8 * $mobile-base; text-align: right; }
          @include tablet { font-size: 0.8 * $tablet-base; text-align: right;}
          @include desktop { font-size: 0.8 * $desktop-base; text-align: right;}
        }
        
        // e.g. Product Detail Size Chart
        @mixin large-link {
          color: $white;
          text-decoration: underline;
          @include normal;
          @include mobile { font-size: 1.5 * $mobile-base; text-align: center; }
          @include tablet { font-size: 1.67 * $tablet-base; text-align: left;}
          @include desktop { font-size: 1.67 * $desktop-base; text-align: left;}
        }
        
        // e.g. Product detail origin price for sale product
        @mixin strikethrough {
          color: $light-gray;
          text-decoration: line-through;
          @include normal;
          @include mobile { font-size: 1.5 * $mobile-base; text-align: center; }
          @include tablet { font-size: 1.67 * $tablet-base; text-align: left;}
          @include desktop { font-size: 1.67 * $desktop-base; text-align: left;}
        }
        
        // --------------------------------------------
        // Styles
        // --------------------------------------------
        body {
          font-family: 'Helvetica Neue', sans-serif;
          font-size: $base-font-size;
          color: $dark-gray;
        }
        
        h1 { @include heading-1; }
        h2 { @include heading-2; }
        h3 { @include heading-3; }
        h4 { @include heading-4; }
        h5 { @include heading-5; }
        h6 { @include heading-6; }
        
        // Primary CTA
        .call-to-action {
          @include primary-call-to-action;
        }
        
        // Paragraph Large (e.g. editorial text)
        .large-paragraph {
          @include large-paragraph;
        }
        
        // Paragraph Normal
        .normal-paragraph,
        p {
          @include normal-paragraph;
        }
        
        // Paragraph Small  (e.g. navigation category)
        .small-paragraph {
          @include small-paragraph;
        }
        
        // e.g. Links under image
        .caption,
        .normal-link {
          @include caption;
        }
        
        // e.g. Product Detail Size Chart
        .small-link {
          @include small-link;
        }
        
        // e.g. Product Detail Size Chart
        .large-link {
          @include large-link;
        }
        
        // e.g. Product detail origin price for sale product
        .strikethrough,
        .product-sale-strikethrough {
          @include strikethrough
        }
        
        // TODO translate this
        // https://salesforce.invisionapp.com/share/GHU820P6QUP#/screens/387062228_Section_Spacing

        `;

        const codeContainer = this.template.querySelector('.code');
        codeContainer.innerHTML = code;

    }
}

export default StyleGuide;
