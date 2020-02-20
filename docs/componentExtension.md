## Customizing and Extending Components

As mentioned in the Architecture.md when customizing or extending the sample app, do not modify the packages within `@sfcc-bff` and `@sfcc-core`. These packages will be published and consumed via NPM. Instead, create a new custom package within the monorepo that registers itself with `@sfcc-core` and provides access to data from a third-party service.

Let's look at an example on how to create a product recommendations extension for product details component:
Background : Product Details Page displays product name, item no, color swatches, images, price etc, but now we want to extend this component to display this product's recommendations on Product Detail Page. 

1. In the storefront-lwc, create a new extension called productDetailExtension.mjs, in there register this extension with core using this key : API_EXTENSION_KEY. Since extensions can have multiple entries per extension key, we can simply do core.registerExtension(API_EXTENSION_KEY, extension).

2. In the productDetailExtension.mjs, we also need to define the extended TypeDef and specify the resolver functionality. Hence we have productRecommendationTypeDef and productRecommendationResolver. 

3. Add the product recommendation extension to the BFF by import this extension we created in step 1 to the sample-app.mjs file. 

4. In the productdetailadapator file we need to tell the BFF the data we need to get back are also including product recommendations.

5. In the productdetail.html, we can consume the data returned from the BFF.

