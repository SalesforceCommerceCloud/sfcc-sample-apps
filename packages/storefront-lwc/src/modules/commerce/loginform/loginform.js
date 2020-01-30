/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api, track } from 'lwc'

import { FormHelper } from 'commerce/data';

export default class LoginForm extends LightningElement {

    constructor() {
        super();
    }

    @track loggedIn = false;
    @track authError = false;

    @track formData = {
        loginEmail: {
            value: '',
            validation: {
                required: true,
                email: true
            },
            errors: []
        },
        loginPassword: {
            value: '',
            validation: {
                required: true
            },
            errors: []
        }
    };

    handleChange(event) {
        let control = event.srcElement;
        let {name, value} = control;
        FormHelper.validate( this.formData, name, control );
        this.formData[ name ].value = value;
    }

    handleSubmit(event) {
        const isValid = FormHelper.validateForm( this.formData );
        // const authHeader = `Basic ${btoa(`${this.formData.loginEmail.value}:${this.formData.loginPassword.value}`)}`;

        this.authError = false;
        if (isValid) {
            try {
                return window.apiClient.mutate( {
                    mutation: window.gql`
                        mutation {
                          login(email: "${this.formData.loginEmail.value}", password: "${this.formData.loginPassword.value}") {
                            customerNo
                            lastName
                            firstName
                            email
                            login
                            authToken
                          }
                        }
                     `
                } ).then( result => {
                    this.loggedIn = true;
                    return result;
                } ).catch( (error) => {
                    this.loggedIn = false;
                    this.authError = true;
                    console.error( 'error', error );
                    return {};
                } );
            } catch (e) {
                console.error( 'exception', e );
                this.loggedIn = true;
                return {};
            }
        }

        event.stopPropagation();
        return false;
    }

    handleGoogle() {
        //https://dev11-sitegenesis-dw.demandware.net/on/demandware.store/Sites-RefArch-Site/en_US/Login-OAuthLogin?oauthProvider=Google&amp;oauthLoginTargetEndPoint=1
        console.info( 'google' );
    }

    handleFacebook() {
        //https://dev11-sitegenesis-dw.demandware.net/on/demandware.store/Sites-RefArch-Site/en_US/Login-OAuthLogin?oauthProvider=Facebook&amp;oauthLoginTargetEndPoint=1
        console.info( 'facebook' );
    }
}