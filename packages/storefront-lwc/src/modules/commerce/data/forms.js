/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
/**
 * Form Helper
 * @type {{validateForm: FormHelper.validateForm, validate: FormHelper.validate}}
 */
export const FormHelper = {
    validateForm: (formData) => {
        let isValid = true;
        Object.keys( formData ).forEach( name => {
            isValid = FormHelper.validate( formData, name ) && isValid;
        } );

        return isValid;
    },

    validate: (formData, name, control) => {
        control = control || document.querySelector( `input[name="${name}"]` ); /* eslint-disable-line */

        let {value} = control;

        // // TODO: check required and other validation
        formData[ name ].errors = [];
        const validation = formData[ name ].validation;
        Object.keys( validation ).forEach( validationKey => {
            switch (validationKey) {
                case 'required':
                    console.log( 'switch req' )
                    if (!value) {
                        formData[ name ].errors.push( {
                            id: validationKey,
                            message: 'This field is required'
                        } )
                    }
                    break;
                case 'match':
                    console.log( 'switch match' )
                    const matchFieldName = validation[ validationKey ];
                    console.log( value, matchFieldName, formData[ matchFieldName ].value )
                    if (value !== formData[ matchFieldName ].value
                        && !(value === '' && formData[ matchFieldName ].value === '')) {
                        formData[ name ].errors.push( {
                            id: validationKey,
                            message: `This field must match ${matchFieldName}`
                        } );
                    }
                    break;
                default:
                    break;
            }
        } );

        // Must set is-invalid css property on control
        if (formData[ name ].errors.length) {
            if (!control.classList.contains( "is-invalid" )) {
                control.classList.add( "is-invalid" );
            }
            return false;
        } else {
            control.classList.remove( "is-invalid" );
            return true;
        }
    }
}
