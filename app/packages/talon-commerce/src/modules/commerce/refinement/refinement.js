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

        //
        // Decorate refinement.values for various template options.
        //
        if (ref && ref.values && ref.values.length) {
            ref.values.forEach(refValue => {
                const isColor = ref.attributeId === 'c_refinementColor';
                console.log('======= ', refValue.value);
                const isSelected = refValue.isSelected || false; // TODO <<<<<<<<<
                const checkStateClasses = `fa ${ isSelected ? 'fa-check-circle' : 'fa-circle-o' }`;
                const color = refValue.label.toLowerCase();
                let newObj = {
                    label: refValue.label,
                    title: `Refine by ${ ref.label }: ${ refValue.label }`,
                    key: ref.label + refValue.value,
                    labelLowerClass: ref.label.toLowerCase() + '-attribute',
                    isSelected,
                    isColor,
                    toggleRefinement: () => this.toggleRefinement(ref.attributeId, refValue.label),
                    checkStateClasses,
                    colorClassNames: !isColor ? '' : `swatch-circle-${ color } swatch-circle color-value swatch-mark ${ isSelected ? 'selected' : '' }`
                };
                newRef.values.push(newObj);
            })
        }
        this._refinement = newRef;
    }

    constructor() {
        super();
    }

    toggleRefinement(refinement, value) {
        // const refinement = event.currentTarget.getAttribute('data-refinement');
        // const value = event.currentTarget.getAttribute('data-value');

        if (refinement && value) {
            const event = new CustomEvent('toggle-refinement', {
                detail: {
                    refinement,
                    value
                }
            });

            window.dispatchEvent(event);
        }
        // html ...() => { this.props.toggleRefinement(refinement, refinement.value); }}>
        //console.log('todo: toggleRefinement send message to productSearchResult component', event.currentTarget);
    }


}
