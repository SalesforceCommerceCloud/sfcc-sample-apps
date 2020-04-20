## Customizing and Extending Components

As mentioned in the [architecture document](architecture.md), when customizing or extending the sample app component, you should not modify the packages within `@sfcc-bff` and `@sfcc-core`. These packages will be published and consumed via `npm`. Instead, create a new custom package either within the monorepo or a new module that registers itself with `@sfcc-core\core` and provides access to data from a third-party service. Then we will need to extend the data model and extend the query for the client component.


This example below shows how to create a product recommendations extension for the product details component:

Background: The Product Details Page shows the product name, product id, color swatches, images, price, and so on. Our goal is to extend this component to also show the product's recommendations. 

1. In the storefront-lwc `app` directory, create a new extension called `productDetailExtension.js`

2. In the `productDetailExtension.js` file, register the extension with core using the `API_EXTENSIONS_KEY` key. Extensions can have multiple entries per extension key, so we can simply register a new extension with the existing key: 

```
core.registerExtension(API_EXTENSIONS_KEY, function (config) {
    return new ProductDetailExtensions();
});
```

3. To Extend the data model, define the Recommendation type and use it to extend the Product type: 

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

4. Resolve the recommendations for a Product
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

5. Add the product recommendation extension to the Backend For Frontend (BFF) by importing the extension created in step 1 to the `sample-app.js` file. 
```
import './extension/productDetailExtension';
```

6. To Extend the query for client component, In the `productdetailadapator.js` file, specify the query for product recommendations.
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

7. In the `productdetail.html` file, consume the recommendations data (if any) returned from the BFF.
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