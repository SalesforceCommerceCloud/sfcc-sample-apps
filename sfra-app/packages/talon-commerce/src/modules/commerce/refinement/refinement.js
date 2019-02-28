import {LightningElement, api, track} from 'lwc'

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
            attribute_id: ref.attribute_id,
            label: ref.label,
            values: []
        };

        //
        // Decorate refinement.values for various template options.
        //
        if (ref && ref.values && ref.values.length) {
            ref.values.forEach(refValue => {
                const isColor = ref.attribute_id === 'c_refinementColor';
                const isSelected = refValue.isSelected; // TODO <<<<<<<<<
                const checkStateClasses = `fa ${isSelected ? 'fa-check-circle' : 'fa-circle-o'}`;
                let newObj = {
                    label: refValue.label,
                    title: `Refine by ${ref.label}: ${refValue.label}`,
                    key: ref.label + refValue.value,
                    labelLowerClass: ref.label.toLowerCase() + '-attribute',
                    isSelected,
                    isColor,
                    toggleRefinement: () => { this.toggleRefinement(ref.attribute_id, refValue.value); },
                    checkStateClasses,
                    colorClassNames: !isColor ? '' : `swatch-circle-${refValue.presentation_id} swatch-circle color-value swatch-mark ${isSelected?'selected':''}`
                };
                newRef.values.push(newObj);
            })
        }
        this._refinement = newRef;
    }

    constructor() {
        super();
    }

    toggleRefinement(refinement, value ) {
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

    // colorClassName = (refinementValue, isSelected) => {
    //   let className = 'swatch-circle-' + refinementValue.presentation_id + ' swatch-circle color-value swatch-mark';
    //   className = isSelected ? className += ' selected' : className;
    //   return className;
    // }

    // render() {
    //   const refinement = this.props.refinement;
    //
    //   // skip if there's no content
    //   if (!refinement.values) {
    //     return null;
    //   }
    //
    //   const isColor = refinement.attribute_id === 'c_refinementColor';
    //
    //   return (
    //     <div key={refinement.attribute_id} className={'card collapsible-sm refinement refinement-' + refinement.label}>
    //       <div className='card-header'>{refinement.label}</div>
    //       <div className='card-body'>
    //         <ul className='values content'>
    //           {(refinement.values || []).map(refinementValue => {
    //             const isSelected = this.props.selectedValues
    //               && this.props.selectedValues.indexOf(refinementValue.value) > -1;
    //             return (
    //               <li className={refinement.label.toLowerCase() + '-attribute'}
    //                 key={refinement.label + refinementValue.value}
    //                 title={'Refine by ' + refinement.label + ': ' + refinementValue.value}
    //                 onClick={() => { this.props.toggleRefinement(refinement, refinementValue.value); }}>
    //
    //                 { /* show circle for everything but color refinements. show checked circle for selected non-color refinements */}
    //                 {!isColor && !isSelected ? <i className='fa fa-circle-o'></i> : ''}
    //                 {!isColor && isSelected ? <i className='fa fa-check-circle'></i> : ''}
    //
    //                 { /* span class changes are relevant for color refinements. They depend on selection */}
    //                 <span title={'Refine by ' + refinement.label + ': ' + refinementValue.label}
    //                   className={isColor ? this.colorClassName(refinementValue, isSelected) : ''}>
    //
    //                   { /* print refinement name for everything but color refinements */}
    //                   {!isColor ? refinementValue.label + ' ' + refinementValue.hit_count : ''}
    //                 </span>
    //               </li>);
    //           }
    //           )}
    //         </ul>
    //       </div>
    //     </div>
    //   );
    // }
}

// Refinement.propTypes = {
//   selectedValues: PropTypes.array,
//   toggleRefinement: PropTypes.func,
//   refinement: PropTypes.shape({
//     attribute_id: PropTypes.string.isRequired,
//     label: PropTypes.string,
//     values: PropTypes.array
//   }).isRequired
// };
