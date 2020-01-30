/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api, track, wire } from 'lwc'

import {FormHelper} from 'commerce/data';

export default class Register extends LightningElement {

    @track accountCreated = false;
    @track accountCreateError = false;

    @api accountId = '';
    // @wire( accountById, { accountId: '$accountId' } )
    // account = {}

    @track account = {
        firstname: {
            value: '',
            validation: {
                required: true
            },
            errors: []
        },
        lastname: {
            value: '',
            validation: {
                required: true
            },
            errors: []
        },
        phone: {
            value: '',
            validation: {
                required: true,
                phone: true
            },
            errors: []
        },
        email: {
            value: '',
            validation: {
                required: true,
                email: true
            },
            errors: []
        },
        confirmemail: {
            value: '',
            validation: {
                required: true,
                email: true,
                match: 'email'
            },
            errors: []
        },
        password: {
            value: '',
            validation: {
                required: true
            },
            errors: []
        },
        confirmpassword: {
            value: '',
            validation: {
                required: true,
                match: 'password'
            },
            errors: []
        },
        addtoemaillist: {
            value: 'jason',
            validation: {},
            errors: []
        }
    };

    handleAccountChange(event) {
        let control = event.srcElement;
        let {name, value} = control;

        FormHelper.validate( this.account, name, control );

        this.account[ name ].value = value;
    }

    handleAccountSubmit(event) {
        this.accountCreateError = false;
        const isValid = FormHelper.validateForm(this.account);
        if (isValid) {
            try {
                return window.apiClient.mutate( {
                    mutation: window.gql`
                        mutation {
                          registerUser(email: "${this.account.email.value}", password: "${this.account.password.value}", firstName: "${this.account.firstname.value}" lastName: "${this.account.lastname.value}") {
                            customerId
                            lastName
                            firstName
                            customerNo
                            email
                          }
                        }
                     `
                } ).then( result => {
                    this.accountCreated = true;
                    return result;
                } ).catch( (error) => {
                    this.accountCreated = false;
                    this.accountCreateError = true;
                    console.error( 'error', error );
                    return {};
                } );
            } catch (e) {
                console.error( 'exception', e );
                this.accountCreateError = true;
                return {};
            }
        }

        event.stopPropagation();
        return false;
    }
}
