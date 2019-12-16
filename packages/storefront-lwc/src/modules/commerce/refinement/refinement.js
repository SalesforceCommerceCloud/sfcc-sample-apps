import { LightningElement, api, track } from 'lwc'

// import PropTypes from 'prop-types';

export default class Refinement extends LightningElement {

    @track _refinement;
    @track cardClass = 'card collapsible-card refinement expanded';
    @track expanded;

    @api
    get refinement() {
        return this._refinement;
    }

    set refinement(ref) {
        // Manual clone to Bypass Proxy and read-only objects
        const newRef = {
            _type: ref._type,
            attribute_id: ref.attributeId,
            label: ref.label,
            values: []
        };

        // Decorate refinement.values for various template options.
        if (ref && ref.values && ref.values.length) {
            ref.values.forEach(refValue => {
                newRef.values.push(this.buildRefinementObject(refValue, ref));
            })
        } else {
            newRef.values = null;
        }
        this._refinement = newRef;
    }

    constructor() {
        super();
    }

    buildRefinementObject(refValue, ref) {
        const isColor = ref.attributeId === 'c_refinementColor';
        const isCategory = ref.attributeId === 'cgid';
        const isSelected = !!refValue.isSelected;
        const color = refValue.label.toLowerCase();
        let newObj = {
            label: refValue.label,
            title: `Refine by ${ ref.label }: ${ refValue.label }`,
            key: ref.label + refValue.value,
            labelLowerClass: ref.label.toLowerCase() + '-attribute',
            isSelected,
            hit_count: refValue.hit_count,
            isColor,
            toggleRefinement: () => this.toggleRefinement(ref.attributeId, (isColor) ? refValue.label : refValue.value),
            categoryClasses: isSelected ? 'refinement-selected category-refinement-item' : 'refinement-not-selected category-refinement-item',
            colorClassNames: !isColor ? '' : `swatch-circle-${ color } ${ isSelected ? 'selected' : '' }`,
            toDisplay: refValue.hit_count > 0,
            isCategory,
            hasSubValues: refValue.values && refValue.values.length,
            values: refValue.values && refValue.values.length ? [] : null
        };

        if (refValue.values && refValue.values.length) {
            refValue.values.forEach(refSubValue => {
                newObj.values.push(this.buildRefinementObject(refSubValue, ref));
            });
        }

        return newObj;
    }

    toggleRefinement(refinement, value) {
        if (refinement && value) {
            const event = new CustomEvent('toggle-refinement', {
                detail: {
                    refinement,
                    value
                }
            });

            window.dispatchEvent(event);
        }
    }

    toggleDropdown() {
        if (this.expanded) {
            this.cardClass = 'card collapsible-card refinement expanded';
        } else {
            this.cardClass = 'card collapsible-card refinement collapsed';
        }

        this.expanded = !this.expanded;
    };
}
