/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/
import { LightningElement, api, wire } from 'lwc';
import { useMutation } from '@lwce/apollo-client';
import { ADDCOUPONMUTATION, REMOVECOUPONMUTATION } from './gqlMutations';

export default class Coupons extends LightningElement {
    variables = {
        couponCode: '',
    };

    showToast = false;

    displayCoupons = [];

    @api set allcoupons(val) {
        this.displayCoupons = val.map(coupon => {
            return {
                couponItemId: coupon.couponItemId,
                couponStatus: coupon.statusCode.replace(/_/g, ' '),
                couponCode: coupon.code,
            };
        });
    }

    get allcoupons() {
        return this.displayCoupons;
    }

    couponError = false;
    couponNotEntered = false;

    set coupon(val) {
        this.variables = { couponCode: val };
    }

    get coupon() {
        return this.variables.couponCode;
    }

    @wire(useMutation, { mutation: ADDCOUPONMUTATION }) addCoupon;

    @wire(useMutation, { mutation: REMOVECOUPONMUTATION }) removeCoupon;

    handleInput(e) {
        this._couponCode = e.target.value;
    }

    submitCoupon() {
        this.clearErrors();
        if (!this._couponCode) {
            this.variables = { couponCode: '' };
            this.couponNotEntered = true;
        } else {
            this.couponNotEntered = false;
            this.variables = { couponCode: this._couponCode };
            this.addCoupon.mutate({ variables: this.variables }).then(() => {
                if (this.addCoupon.error) {
                    this.couponError = true;
                } else {
                    this.dispatchUpdateBasketEvent(
                        this.addCoupon.data.addCouponToBasket,
                    );
                }
            });
        }
    }

    deleteCoupon(e) {
        this.clearErrors();
        const couponItemId = e.currentTarget.getAttribute('data-itemid');
        const vars = {
            couponItemId: couponItemId,
        };
        this.removeCoupon.mutate({ variables: vars }).then(() => {
            if (this.removeCoupon.error) {
                this.showToast = true;
            } else {
                this.dispatchUpdateBasketEvent(
                    this.removeCoupon.data.removeCouponFromBasket,
                );
            }
        });
    }

    submitCouponOnEnter(e) {
        if (e.key === 'Enter') {
            this.submitCoupon();
            e.preventDefault();
        }
    }

    clearErrors() {
        this.variables = { couponCode: '' };
        this.couponError = false;
        this.couponNotEntered = false;
    }

    dispatchUpdateBasketEvent(updatedBasket) {
        this.clearErrors();
        const event = new CustomEvent('updatebasket', {
            detail: { updatedBasket },
        });
        this.dispatchEvent(event);
    }

    toastMessageDisplayed() {
        this.showToast = false;
    }
}
