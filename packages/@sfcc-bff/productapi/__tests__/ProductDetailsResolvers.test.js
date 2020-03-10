import {
    getClientProduct,
    resolver as productDetailsResolver,
} from '../src/api/schema/productDetailsResolvers';

describe('Product API Product Detail Resolvers', () => {
    /*
     TODO: need valid (syntactically) api config data

     A:
     TBD: mock commerce-sdk : CommerceSdk.Product.ShopperProducts()
     TDB: mock data from CommerceSdk.Product.ShopperProducts()

     OR -

     B:
     TBD: mock async call to productDetailsResolver getClientProduct()

     OR -

     C: Mock graphql server
     TBD:  https://graphql.org/blog/mocking-with-graphql/

     then verify new Product
    */
    it('should return a new Product Detail Data', () => {
        // TODO: productDetailsResolver resolver(config)
        expect(1).toEqual(1);
    });
});

/*

// graphql mockServer
// ==================

// > npm install graphql-tools
import { mockServer } from 'graphql-tools';
import schema from './mySchema.graphql';

const myMockServer = mockServer(schema);
myMockServer.query(`{
  allUsers: {
    id
    name
  }
}`);

// returns
// {
//   data: {
//     allUsers:[
//       { id: 'ee5ae76d-9b91-4270-a007-fad2054e2e75', name: 'lorem ipsum' },
//       { id: 'ca5c182b-99a8-4391-b4b4-4a20bd7cb13a', name: 'quis ut' }
//     ]
//   }
// }
 */
