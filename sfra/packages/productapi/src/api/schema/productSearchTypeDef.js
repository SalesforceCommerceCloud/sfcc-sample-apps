import { gql } from 'apollo-server-core';

export const typeDef = gql`
    extend type Query {
        productSearch(query: String!): [ProductHit]
    }

    type ProductHit {
        id: String!
        name: String!
        price: Float!
        image: Image!
    }
`;


adsf = {
    "errors": [ {
        "message": "Cannot query field \"productSearch\" on type \"Query\". Did you mean \"product\"?",
        "locations": [ { "line": 2, "column": 3 } ],
        "extensions": {
            "code": "GRAPHQL_VALIDATION_FAILED", "exception": {
                "stacktrace": [ "Cannot query field \"productSearch\" on type \"Query\". Did you mean \"product\"?", "", "GraphQL request (2:3)", "1: {", "2:   productSearch(query: \"shirt\") {", "     ^", "3:     name", "", "    at Object.Field (/Volumes/Share/sf/sfra-next/sfra-app/node_modules/graphql/validation/rules/FieldsOnCorrectType.js:65:31)", "    at Object.enter (/Volumes/Share/sf/sfra-next/sfra-app/node_modules/graphql/language/visitor.js:324:29)", "    at Object.enter (/Volumes/Share/sf/sfra-next/sfra-app/node_modules/graphql/language/visitor.js:366:25)", "    at visit (/Volumes/Share/sf/sfra-next/sfra-app/node_modules/graphql/language/visitor.js:254:26)", "    at visitUsingRules (/Volumes/Share/sf/sfra-next/sfra-app/node_modules/graphql/validation/validate.js:73:22)", "    at Object.validate (/Volumes/Share/sf/sfra-next/sfra-app/node_modules/graphql/validation/validate.js:58:10)", "    at validate (/Volumes/Share/sf/sfra-next/sfra-app/node_modules/apollo-server-core/src/requestPipeline.ts:338:22)", "    at Object.<anonymous> (/Volumes/Share/sf/sfra-next/sfra-app/node_modules/apollo-server-core/src/requestPipeline.ts:214:32)", "    at Generator.next (<anonymous>)", "    at fulfilled (/Volumes/Share/sf/sfra-next/sfra-app/node_modules/apollo-server-core/dist/requestPipeline.js:4:58)", "    at process.internalTickCallback (internal/process/next_tick.js:77:7)" ]
            }
        }
    } ]
}

asdfasd = {
    "operationName": null,
    "variables": {},
    "query": {
        productSearch(query: "shirt") {
            name
            id
        }
    }
}