import { BaseClient, Response } from "./core";
export default class extends BaseClient {
    constructor();
    /**
    * Allows to access multiple products by a single request. This convenience resource should be used instead making separated requests. This saves bandwidth and CPU time on the server. The URI is the same like requesting a single Product by id, but multiple ids wrapped by parentheses and separated can be provided. If a parenthesis or the separator is part of the identifier itself it has to be URL encoded. Instead of a single Product document a result object of Product documents is returned. Note: Only products that are online and assigned to site catalog are returned. The maximum number of ids is 24. If none of the products requested are found, the cache-control header will be defaulted to 60 seconds.
    */
    getProducts(parameters?: {}): Promise<Response>;
    /**
    * To access single products resource, you construct a URL using the template shown below. This template requires
   you to specify an Id (typically a SKU) for a product. In response, the server returns a corresponding Product
   document, provided the product is online and assigned to site catalog. The document contains variation attributes
   (including values) and the variant matrix; this data is provided for both the master and for the variant.
    */
    getProduct(parameters?: {}): Promise<Response>;
    /**
    * When you use the URL template below, the server returns multiple categories (a result object of category documents). You can use this template as a convenient way of obtaining multiple categories in a single request, instead of issuing separate requests for each category. You can specify multiple ids (up to a maximum of 50). You must enclose the list of ids in parentheses. If a category identifier contains a parenthesis or the separator sign, you must URL encode the character. The server only returns online categories.
    */
    getCategories(parameters?: {}): Promise<Response>;
}
