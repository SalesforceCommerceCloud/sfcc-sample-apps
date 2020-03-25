/*
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
*/

'use strict';

const getLowestPromotionalPrice = promotions => {
    if (promotions && promotions.length) {
        let lowestPrice = promotions.reduce(function(prev, curr) {
            if (prev && curr) {
                if (prev.promotionalPrice && curr.promotionalPrice) {
                    return prev.promotionalPrice < curr.promotionalPrice
                        ? prev
                        : curr;
                } else if (!prev.promotionalPrice && curr.promotionalPrice) {
                    return curr;
                } else if (prev.promotionalPrice && !curr.promotionalPrice) {
                    return prev;
                } else {
                    return;
                }
            } else if (prev && !curr) {
                return prev;
            } else if (!prev && curr) {
                return curr;
            } else {
                return;
            }
        });

        return lowestPrice && lowestPrice.promotionalPrice
            ? lowestPrice.promotionalPrice
            : null;
    }

    return null;
};

export const getPrices = apiProduct => {
    let lowestPromotionalPrice = getLowestPromotionalPrice(
        apiProduct.productPromotions,
    );
    let prices = {
        sale: lowestPromotionalPrice
            ? lowestPromotionalPrice
            : apiProduct.price,
    };
    if (apiProduct.prices) {
        if (
            apiProduct.prices['usd-m-sale-prices'] &&
            apiProduct.prices['usd-m-list-prices']
        ) {
            prices.sale = lowestPromotionalPrice
                ? lowestPromotionalPrice
                : apiProduct.prices['usd-m-sale-prices'];
            prices.list = apiProduct.prices['usd-m-list-prices'];
            if (prices.sale === prices.list) {
                prices.list = null;
            }
        } else if (
            apiProduct.prices['usd-m-sale-prices'] &&
            !apiProduct.prices['usd-m-list-prices']
        ) {
            prices.sale = lowestPromotionalPrice
                ? lowestPromotionalPrice
                : apiProduct.prices['usd-m-sale-prices'];
            prices.list = null;
        } else if (
            !apiProduct.prices['usd-m-sale-prices'] &&
            apiProduct.prices['usd-m-list-prices']
        ) {
            prices.sale = lowestPromotionalPrice
                ? lowestPromotionalPrice
                : apiProduct.prices['usd-m-list-prices'];
            prices.list = null;
        }
    }
    return prices;
};
