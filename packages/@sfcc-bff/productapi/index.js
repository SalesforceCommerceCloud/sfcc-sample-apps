'use strict';

var core = require('@sfcc-core/core');
var coreGraphql = require('@sfcc-core/core-graphql');
var apolloServerCore = require('apollo-server-core');
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
    }

    type Image {
        title: String!
        alt: String!
        link: String!
    }
`;

class Image {
    constructor(image) {
        this.title = image.title;
        this.alt = image.alt;
        this.link = image.link;
    }
}

var getImages = (imageGroups) => {
    return ({ allImages, size }) => {
        let result = [];

        let imageGroup = imageGroups.find((group) => group.view_type === size);

        if (allImages) {
            imageGroup.images.forEach((image) => {
                result.push(new Image(image));
            });
        } else {
            result.push(new Image(imageGroup.images[0]));
        }
    
        return result;
    };
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
        console.log('==== this =====', this);
    }
}

const getProduct = (config, productId) => {
    const URL_PARAMS = `&expand=availability,images,prices,variations&all_images=true`;
    const PRODUCT_URL = `${config.COMMERCE_BASE_URL}/products/${productId}?client_id=${config.COMMERCE_APP_API_CLIENT_ID}${URL_PARAMS}`;
    console.log('---- GETTING PRODUCT FROM API ---- ');
    console.log('---- URL ---- ' + PRODUCT_URL);
    return new Promise((resolve, reject) => {
        Promise.all([
            rp.get({
                uri: PRODUCT_URL,
                json: true
            })
        ]).then(([product]) => {
            resolve(product);
        }).catch((err) => {
            reject(err);
        });
    });
};

const resolver = (config) => {
    return {
        Query: {
            product: (_, {id}) => {
                const productModel = getProduct(config, id).then((product) => {
                    console.log("---- Received Product from API ----");
                    return new Product(product);
                });
                return productModel;
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
