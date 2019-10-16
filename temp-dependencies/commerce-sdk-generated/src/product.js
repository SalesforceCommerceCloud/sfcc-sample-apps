"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./core");
class default_1 extends core_1.BaseClient {
    constructor() {
        super("https://anypoint.mulesoft.com/mocking/api/v1/links/273546ce-4e1a-4bdb-9f07-c852df772b1d/shop-products-catalogs/domain/v1/organizations/organizationId");
    }
    /**
    * Allows to access multiple products by a single request. This convenience resource should be used instead making separated requests. This saves bandwidth and CPU time on the server. The URI is the same like requesting a single Product by id, but multiple ids wrapped by parentheses and separated can be provided. If a parenthesis or the separator is part of the identifier itself it has to be URL encoded. Instead of a single Product document a result object of Product documents is returned. Note: Only products that are online and assigned to site catalog are returned. The maximum number of ids is 24. If none of the products requested are found, the cache-control header will be defaulted to 60 seconds.
    */
    getProducts(parameters = {}) {
        const pathParameters = {};
        const queryParameters = {
            "ids": parameters["ids"],
            "expand": parameters["expand"],
            "inventoryIds": parameters["inventoryIds"],
            "currency": parameters["currency"],
            "locale": parameters["locale"],
            "allImages": parameters["allImages"]
        };
        const requiredQueryParameters = [];
        requiredQueryParameters.push("ids");
        for (let param in requiredQueryParameters) {
            if (queryParameters[param] === undefined
                || queryParameters[param] === null) {
                throw new Error(`Parameter '${param}' is required when calling getProducts`);
            }
        }
        return this._get("/products", pathParameters, queryParameters);
    }
    /**
    * To access single products resource, you construct a URL using the template shown below. This template requires
   you to specify an Id (typically a SKU) for a product. In response, the server returns a corresponding Product
   document, provided the product is online and assigned to site catalog. The document contains variation attributes
   (including values) and the variant matrix; this data is provided for both the master and for the variant.
    */
    getProduct(parameters = {}) {
        const pathParameters = {
            "id": parameters["id"]
        };
        for (let param in pathParameters) {
            if (pathParameters[param] === undefined
                || pathParameters[param] === null) {
                throw new Error(`Parameter '${param}' is required when calling getProduct`);
            }
        }
        const queryParameters = {
            "expand": parameters["expand"],
            "inventoryIds": parameters["inventoryIds"],
            "currency": parameters["currency"],
            "locale": parameters["locale"],
            "allImages": parameters["allImages"]
        };
        const requiredQueryParameters = [];
        for (let param in requiredQueryParameters) {
            if (queryParameters[param] === undefined
                || queryParameters[param] === null) {
                throw new Error(`Parameter '${param}' is required when calling getProduct`);
            }
        }
        return this._get("/products/{id}", pathParameters, queryParameters);
    }
    /**
    * When you use the URL template below, the server returns multiple categories (a result object of category documents). You can use this template as a convenient way of obtaining multiple categories in a single request, instead of issuing separate requests for each category. You can specify multiple ids (up to a maximum of 50). You must enclose the list of ids in parentheses. If a category identifier contains a parenthesis or the separator sign, you must URL encode the character. The server only returns online categories.
    */
    getCategories(parameters = {}) {
        const pathParameters = {};
        const queryParameters = {
            "ids": parameters["ids"],
            "levels": parameters["levels"],
            "locale": parameters["locale"]
        };
        const requiredQueryParameters = [];
        requiredQueryParameters.push("ids");
        for (let param in requiredQueryParameters) {
            if (queryParameters[param] === undefined
                || queryParameters[param] === null) {
                throw new Error(`Parameter '${param}' is required when calling getCategories`);
            }
        }
        return this._get("/categories", pathParameters, queryParameters);
    }
}
exports.default = default_1;
