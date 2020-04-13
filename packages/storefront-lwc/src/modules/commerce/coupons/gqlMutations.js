import gql from 'graphql-tag';

const basketQuery = `
    basketId
    customerId
    getBasketMessage
    totalProductsQuantity
    shipmentId
    shipmentTotal
    selectedShippingMethodId
    products {
        productId
        itemId
        quantity
        productName
        price
        imageURL
        inventory {
            ats
            backorderable
            id
            orderable
            preorderable
            stockLevel
        }
        itemTotalAfterDiscount
        itemTotalNonAdjusted
        variationAttributes {
            id
            name
            selectedValue {
                name
                orderable
                value
            }
        }
        prices {
            list
            sale
        }
        productPromotions {
            calloutMsg
            promotionalPrice
            promotionId
        }
    }
    orderTotal
    orderLevelPriceAdjustment {
        itemText
        price
    }
    shippingLevelPriceAdjustment {
        itemText
        price
    }
    shippingTotal
    shippingTotalTax
    taxation
    taxTotal
    couponItems {
        code
        couponItemId
        statusCode
    }
`;

export const ADDCOUPONMUTATION = gql`
    mutation addCouponToBasket($couponCode: String!) {
        addCouponToBasket(couponCode: $couponCode) {
            ${basketQuery}
        }
    }
`;

export const REMOVECOUPONMUTATION = gql`
    mutation removeCouponFromBasket($couponItemId: String!) {
        removeCouponFromBasket(couponItemId: $couponItemId) {
            ${basketQuery}
        }
    }
`;
