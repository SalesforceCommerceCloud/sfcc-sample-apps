<!---
    Copyright (c) 2020, salesforce.com, inc.
    All rights reserved.
    SPDX-License-Identifier: BSD-3-Clause
    For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
-->
# Basket Component

## Functional Description
The Basket component is an interactive component that fetches and displays the current shopper's basket. To fetch the basket, the component issues a `getBasket` request. The `getBasket` request can return an empty basket page or it can return a basket page that includes related information. For example, the basket page can include product images, names, variation attributes, product line item unit prices, product line item total prices, availability, shipping methods, coupons, and basket totals.

## LWC Custom Element Tag Usage
`<commerce-product-line-item product={product} key={product.productId}></commerce-product-line-item>`

`<commerce-coupons allcoupons={basket.couponItems} onupdatebasket={updateBasket}></commerce-coupons>`

`<commerce-shippingmethods shipping-label="Shipping" shipping-methods={shippingMethods} selected-shipping-method-id={selectedShippingMethodId}></commerce-shippingmethods>`

`<commerce-basket-totals basket={basket}></commerce-basket-totals>`
## Behavior  
* If the shopper views the basket page before adding any products to the basket, or if the shopper removes all products from the basket, an empty basket page is shown.
* If the shopper adds products to the basket, a basket page is shown with product details for each product line item, coupon field, shipping methods, and basket total -- all of which are rendered using the child LWC components listed above.  
* The product details information is retrieved using a separate SDK API method, `getProducts()`. The maximum number of productIDs this method accepts is 24. 
* Ground shipping is the default shipping method, but the shopper can select other shipping methods. If the shopper changes the shipping method, the shipping cost and basket total are recalculated. 
* The shopper can enter a coupon code in the promo code field. (The coupon code is configured in Business Manager.) If the submitted coupon is valid, it is applied, and the basket total is recalculated. If the submitted coupon is not valid, an error message is displayed.
* If the shopper deletes product line items in the basket, the basket total is recalculated. 
* An authorization token is used to authenticate some basket requests. Each token expires after 30 minutes. When a token expires, the requests are retried using a refreshed token, and the basket is recreated with a new basket id if the basket id is needed. For more information, see [Session Management](../../../../../../docs/sessionManagement.md).
