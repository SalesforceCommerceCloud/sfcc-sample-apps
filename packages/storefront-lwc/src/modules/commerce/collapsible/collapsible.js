/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api } from 'lwc';

export default class CollapsibleContent extends LightningElement {
    @api title;
    @api content;

    toggledropdown(event) {
        const toggleButton = event.target;
        const divCard = event.target.parentElement.parentElement;
        const [, divCollapse] = divCard.children;

        if (divCollapse.classList.contains('show')) {
            divCollapse.classList.remove('show');
            toggleButton.classList.remove('active');
            toggleButton.setAttribute('aria-expanded', false);
        } else {
            divCollapse.classList.add('show');
            toggleButton.classList.add('active');
            toggleButton.setAttribute('aria-expanded', true);
        }
    }

    renderedCallback() {
        this.template.querySelector('.card-body').innerHTML = this.content
            ? this.content
            : '';
    }
}
