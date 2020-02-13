/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api, track } from 'lwc';

export default class RefinementGroup extends LightningElement {
    @track cardClass = 'card collapsible-card refinement expanded';
    @track expanded;
    @track displayRefinementGroup = {};

    @api
    get refinementgroup() {
        return this.displayRefinementGroup;
    }

    set refinementgroup(ref) {
        // Manual clone to Bypass Proxy and read-only objects
        const newRef = {
            _type: ref._type,
            attributeId: ref.attributeId,
            label: ref.label,
            hitCount: ref.hitCount,
            values: ref.values ? [...ref.values] : [],
        };

        // Decorate refinement.values for various template options.
        newRef.values = newRef.values.map(refValue => {
            return this.buildRefinementObject(refValue, ref);
        });

        this.displayRefinementGroup = newRef;
    }

    buildRefinementObject(refValue, ref) {
        const isColor = ref.attributeId === 'c_refinementColor';
        const isCategory = ref.attributeId === 'cgid';
        const isSelected = !!refValue.isSelected;
        const color = refValue.label.toLowerCase();
        const newObj = {
            attributeId: ref.attributeId,
            label: refValue.label,
            title: `Refine by ${ref.label}: ${refValue.label}`,
            key: ref.label + refValue.value,
            labelLowerClass: ref.label.toLowerCase() + '-attribute',
            isSelected,
            hitCount: refValue.hitCount || refValue.hitCount,
            isColor,
            categoryClasses: isSelected
                ? 'refinement-selected category-refinement-item'
                : 'refinement-not-selected category-refinement-item',
            colorClassNames: !isColor
                ? ''
                : `swatch-circle-${color} ${isSelected ? 'selected' : ''}`,
            toDisplay: refValue.hitCount > 0,
            isCategory,
            hasSubValues: refValue.values && refValue.values.length,
            value: refValue.value,
            values:
                refValue.values && refValue.values.length
                    ? [...refValue.values]
                    : [],
        };

        // Decorate refinement.values for various template options.
        newObj.values = newObj.values.map(refSubValue => {
            return this.buildRefinementObject(refSubValue, ref);
        });

        return newObj;
    }

    toggleDropdown() {
        if (this.expanded) {
            this.cardClass = 'card collapsible-card refinement expanded';
        } else {
            this.cardClass = 'card collapsible-card refinement collapsed';
        }
        this.expanded = !this.expanded;
    }
}
