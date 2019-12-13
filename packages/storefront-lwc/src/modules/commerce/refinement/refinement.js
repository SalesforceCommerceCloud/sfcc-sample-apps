import { LightningElement, api, track } from 'lwc'

// import PropTypes from 'prop-types';

export default class Refinement extends LightningElement {

    @track _refinement;

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
        const isSelected = !!refValue.isSelected
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

    toggleDropdown(event) {
        // test
        const toggleButton = event.target;
        const divCard = event.target.parentElement.parentElement;
        const divCollapse = divCard.children[1];

        if (divCollapse.classList.contains('show')) {
            divCollapse.classList.remove('show');
            toggleButton.classList.remove('active');
            divCard.classList.add('collapsed');
            toggleButton.setAttribute("aria-expanded", false);
        } else {
            divCollapse.classList.add('show');
            toggleButton.classList.add('active');
            divCard.classList.remove('collapsed');
            toggleButton.setAttribute("aria-expanded", true);
        }
    }
}
