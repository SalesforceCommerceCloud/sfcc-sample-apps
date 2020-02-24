## Customizing and Extending Components

the new package should be either part of the application or a partner can create his own module with the extension

As mentioned in the [architecture document](architecture.md), when customizing or extending the sample app component, you should not modify the packages within `@sfcc-bff` and `@sfcc-core`. These packages will be published and consumed via `npm`. Instead, create a new custom package within the monorepo or create a new module that registers itself with `@sfcc-core\core` and provides access to data from a third-party service. Then we will need to extend the data model and extend the query for the client component.

This example below illustrates how to create a product recommendations extension for product details component:

Background : Product Details Page displays product name, product id, color swatches, images, price, etc. Our goal is to extend this component to display the product's recommendations on the Product Detail Page. 

1. In the storefront-lwc, create a new extension called `productDetailExtension.mjs`. Register this extension with core using this key : `API_EXTENSION_KEY`. Since extensions can have multiple entries per extension key, we can simply register a new extension with the existing key: 

```
core.registerExtension(API_EXTENSIONS_KEY, function (config) {
    return new ProductDetailExtensions();
});
```

2. To Extend the data model, define the Product recommendation, and the Recommendation TypeDef 

```
const productRecommendationTypeDef = gql`
    type Recommendation {
        productId: String
        productName: String
        image: Image
    }
    extend type Product {
        recommendations: [Recommendation]
    }
`;
``` 

3. Resolve the Recommendation for a Product
```
const productRecommendationResolver = (config) => {
    return {
        Product: {
            recommendations: async (product) => {
                if (product.recommendations) {
                    return Promise.all(product.recommendations.map( async recommendation => {
                        const apiProduct = await getClientProduct(config, recommendation.recommendedItemId);
                            return {productId: apiProduct.id, productName:apiProduct.name, image: new Image(apiProduct.imageGroups[2].images[0])};
                        })
                    )
                }
            }
        }
    }
}
```

4. Add the product recommendation extension to the BFF by importing this extension created in step 1 to the sample-app.mjs file. 
```
import './extension/productDetailExtension';
```

5. To Extend the query for client component, in the `productdetailadapator.js` file we need to tell the BFF the data we want to query for product recommendations.
```
recommendations {
    productId
    productName
    image {
        title
        link
        alt
    }
}
```

6. In the `productdetail.html`, we can consume the recommendataions data returned from the BFF if any exists.
``` 
<!-- Product Recommendations -->
<template if:true={product.recommendations}>
    <div class="recommendation">
        <template for:each={product.recommendations} for:item="recommendation">
            <div class='col-6 col-sm-4 grid-gutter' key={recommendation.productId} >
                <div class='product' >
                    <commerce-product-tile product={recommendation}></commerce-product-tile>
                </div>
            </div>
        </template>
    </div>
</template>
```
