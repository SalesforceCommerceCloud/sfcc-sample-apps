'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var core = require('@sfcc-core/core');
var coreGraphql = require('@sfcc-core/core-graphql');
var apolloServerCore = require('apollo-server-core');
var fetch = _interopDefault(require('node-fetch'));
var commerceSdkGenerated = require('commerce-sdk-generated');
var rp = require('request-promise');

const typeDef = apolloServerCore.gql`
    extend type Query {
        product(id: String!): Product
    }

    type Product {
        id: String!
        name: String!
        price: Float!
        currency: String!
        page_description: String!
        long_description: String!
        short_description: String!
        primary_category_id: String!
        image: String!
        images(allImages: Boolean = true, size: String = "large"): [Image!]
        variants: [Variant],
        variationAttributes: [VariationAttribute]
    }

    type Image {
        title: String!
        alt: String!
        link: String!
    }

    type Variant {
        id: String!
        variationValues: [VariationValue]
    }

    type VariationValue {
        key: String!
        value: String!
    }

    type VariationAttribute {
        variationAttributeType: VariationAttributeType,
        variationAttributeValues: [VariationAttributeValues]
    }

    type VariationAttributeType {
        id: String!
        name: String!
    }

    type VariationAttributeValues {
        name: String!
        value: String!
        orderable: Boolean!
    }
`;

class Image {
    constructor(image) {
        this.title = image.title;
        this.alt = image.alt;
        this.link = image.link;
    }
}

const getImages = (imageGroups) => {
    return ({allImages, size}) => {
        let result = [];

        const tmpHash = {};

        // Return all images if allImages and all sizes asked for
        if (allImages && size === 'all') {
            imageGroups.forEach(imageGroup => {
                imageGroup.images.forEach((image) => {
                    // ensure unique image being returned
                    if ( !tmpHash[image.link] ) {
                        result.push(new Image(image));
                        tmpHash[image.link] = true;
                    }
                });
            });
        } else {
            // Find images of the size requested (default large)
            let sizeImages = [];
            imageGroups.forEach(imageGroup => {
                if (imageGroup.view_type === size) {
                    sizeImages = sizeImages.concat(imageGroup.images);
                }
            });

            // Return all of this size when all images are requested
            if (allImages) {
                sizeImages.forEach((image) => {
                    // ensure unique image being returned
                    if ( !tmpHash[image.link] ) {
                        result.push(new Image(image));
                        tmpHash[image.link] = true;
                    }
                });
            } else {
                // Only first of the size requested when all images false
                result.push(new Image(sizeImages[0]));
            }
        }

        return result;
    };
};

var getVariants = (variants) => {
    return () => {
        let result = variants.map(variant => {
            let variationValues = Object.keys(variant.variation_values).map(key => {
                return {
                    key: key,
                    value: variant.variation_values[key]
                }
            });
            return {
                id: variant.product_id,
                variationValues: Object.keys(variant.variation_values).map(key => {
                    return {
                        key: key,
                        value: variant.variation_values[key]
                    }
                })
            }
        });
        return result;
    };
};

var getVariationAttributes = (variationAttributes) => {
    return () => {
        return variationAttributes.map(variationAttribute => {
            return {
                variationAttributeType: {
                    id: variationAttribute.id,
                    name: variationAttribute.name,
                },
                variationAttributeValues: variationAttribute.values.map(variationAttributeValue => {
                    return {
                        name: variationAttributeValue.name,
                        value: variationAttributeValue.value,
                        orderable: variationAttributeValue.orderable
                    }
                })
            }
        })
    }
};

class Product {
    constructor(apiProduct) {
        this.id = apiProduct.id;
        this.name = apiProduct.name;
        this.price = apiProduct.price;
        this.images = getImages(apiProduct.image_groups);

        console.log('Product.constructor(apiProduct)', apiProduct);
        Object.assign(this, apiProduct);

        // TODO: remove the following and use the above this.images
        this.image = apiProduct.image_groups[0].images[0].link;
        this.variants = getVariants(apiProduct.variants);
        this.variationAttributes = getVariationAttributes(apiProduct.variation_attributes);
    }
}

const getOcapiProduct = async (config, productId) => {
    const URL_PARAMS = `&expand=availability,images,prices,variations&all_images=true`;
    const PRODUCT_URL = `${config.COMMERCE_BASE_URL}/products/${productId}?client_id=${config.COMMERCE_APP_API_CLIENT_ID}${URL_PARAMS}`;
    return await fetch(PRODUCT_URL).then(res => res.json());
};

const getSdkProduct = async (id) => {
    const client = new commerceSdkGenerated.Product();
    return await client.getProduct({id}).then(res => res.json());
};

const resolver = (config) => {
    return {
        Query: {
            product: async (_, {id}) => {
                let apiProduct;
                if (id === "apple-ipod-shuffle") {
                    apiProduct = await getSdkProduct(id);
                } else {
                    apiProduct = await getOcapiProduct(config, id);
                }
                return new Product(apiProduct);
            }
        }
    }
};

const typeDef$1 = apolloServerCore.gql`
    extend type Query {
        productSearch(query: String!, filterParams: [Filter]): SearchResult
    }

    type SearchResult {
        count: Int!
        productHits: [ProductHit]
        currentFilters: [CurrentFilter]
        refinements: [Refinement]
    }

    type ProductHit {
        id: String!
        name: String!
        price: Float!
        image: Image!
    }

    type Refinement {
        attributeId: String!
        label: String!
        values: [RefinementValue]
    }

    type RefinementValue {
        label: String!
        value: String!
    }

    type CurrentFilter {
        id: String!
        value: String!
    }

    input Filter {
        id: String!
        value: String!
    }
`;

class SearchResultProduct {
    constructor(product) {
        this.id = product.product_id;
        this.name = product.product_name;
        this.price = product.price;
        this.image = new Image(product.image);
        Object.assign(this, product);
        console.log(product);
    }
}

class SearchResult {
    constructor(searchResult, filterParams) {
        this.count = searchResult.count;
        this.productHits = searchResult['hits'] && searchResult['hits'].length ? searchResult.hits.map((product) => new SearchResultProduct(product)) : [];
        this.currentFilters = filterParams ? filterParams : null;
        this.refinements = searchResult.refinements.map((refinement) => {
            return {
                attributeId: refinement.attribute_id,
                label: refinement.label,
                values: refinement.values ? refinement.values.map((value) => {
                    return {
                        label: value.label,
                        value: value.value
                    }
                }) : null
            }
        });
    }
}

const processFilterParams = (filterParams) => {
    let filterParamQuery = '';
    let refinementNumber = 0;
    filterParams.forEach((filter) => {
        if (filter.id === 'sort') {
            filterParamQuery = `${filterParamQuery}&${filter.id}=${filter.value}`;
        } else {
            refinementNumber++;
            filterParamQuery = `${filterParamQuery}&refine_${refinementNumber}=${filter.id}=${filter.value}`;
        }
    });
    return filterParamQuery;
};

const searchProduct = (config, query, filterParams) => {
    const URL_PARAMS = `expand=images,prices,variations`;
    const URL_FILTER_PARAMS = filterParams ? processFilterParams(filterParams) : null;
    let searchUrl = `${config.COMMERCE_BASE_URL}/product_search?client_id=${config.COMMERCE_APP_API_CLIENT_ID}&q=${query}&${URL_PARAMS}`;
    if (URL_FILTER_PARAMS) {
        searchUrl = searchUrl + URL_FILTER_PARAMS;
    }
    console.log('---- GETTING PRODUCT SEARCH RESULTS ---- ');
    console.log('---- URL ---- ' + searchUrl);
    return new Promise((resolve, reject) => {
        Promise.all([
            rp.get({
                uri: searchUrl,
                json: true
            })
        ]).then(([searchResult]) => {
            resolve(searchResult);
        }).catch((err) => {
            reject(err);
        });
    });
};

const resolver$1 = (config) => {
    return {
        Query: {
            productSearch: (_, {query, filterParams}) => {
                const result = searchProduct(config, query, filterParams).then((searchResult) => {
                    console.log("---- Received Search Results from API ----");
                    return new SearchResult(searchResult, filterParams);
                });
                console.log("==================");
                console.log(result);
                return result;
            }
        }
    }
};

// Product Details

// SFRA Core Extension module

class ProductAPI {
    constructor(core$$1) {
        this.core = core$$1;
        this.core.logger.log('ProductAPI.constructor(core)');
    }

    get typeDefs() {
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        core.core.logger.log('ProductAPI.typeDefs()', typeDef, typeDef$1);
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        return [typeDef, typeDef$1];
    }

    getResolvers(config) {
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        core.core.logger.log('ProductAPI.getResolvers()', config);
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        return coreGraphql.resolverFactory(config,[resolver, resolver$1]);
    }

    getDataSources(config) {
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        core.core.logger.log('ProductAPI.getDataSources()', config);
        core.core.logger.log('===========================');
        core.core.logger.log('===========================');
        return coreGraphql.dataSourcesFactory(config, []);
    }

}

core.core.registerExtension(core.API_EXTENSIONS_KEY, function (config) {
    const productAPI = new ProductAPI(core.core);
    return productAPI;
});

module.exports = ProductAPI;
