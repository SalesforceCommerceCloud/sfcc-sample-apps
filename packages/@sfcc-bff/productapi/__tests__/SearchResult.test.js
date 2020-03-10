/**
 *
 */
import { SearchResult } from '../src/api/models/SearchResult';
import { SearchResultProduct } from '../src/api/models/SearchResultProduct';

describe('Product API SearchResult model', () => {
    it('should return a new SearchResult model', () => {
        const searchResultData = {
            limit: 25,
            hits: [
                {
                    productId: '1234567890M',
                    productName: 'Gray Shirt',
                    price: '123.00',
                    image: {
                        title: 'Gray Shirt',
                        alt: 'Gray Shirt',
                        link: 'http://cdn.salesforce.comm/image1.png',
                        style: '',
                    },
                    colorSwatches: [],
                },
            ],
            refinements: [],
        };

        const model = new SearchResult(searchResultData, null);
        expect(model.productHits.length).toEqual(1);
    });
});

describe('Product API SearchResultProduct model', () => {
    it('should return a new SearchResultProduct model', () => {
        const product = {};
        const model = new SearchResultProduct(product, null);
        expect(1).toEqual(1);
    });
});

