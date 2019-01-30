import gql from 'graphql-tag';
import { graphql } from 'graphql';
import * as Test1 from 'apollo-client';
import * as Test2 from 'apollo-link';
import * as Test3 from 'apollo-utilities';
import * as Test4 from 'graphql-anywhere';
import { RestLink } from 'apollo-link-rest';

import config from '../config/api';

/**
 * Fetch content asset by ID
 *
 * @param {string} contentIds
 */
const fetchContents = ( contentIds ) => {
    const ids = contentIds.join( ',' );
    const url = config.content.replace( '$CONTENT_IDs', ids );
    return fetch( url )
        .then( response => response.json() )
        .catch( ( e ) => {
            console.log( 'An error occured while fetching ' + url + '\n' + e );
            throw new Error( `Content ids '${ids}' could not be fetched.` );
        } );
};

/**
 * Fetch categories by ID
 *
 * @param {string} categoryId
 */
const fetchCategory = ( categoryId ) => {
    const url = config.category.replace( '$CATEGORY_ID', categoryId );
    return fetch( url )
        .then( response => response.json() )
        .catch( ( e ) => {
            console.log( 'An error occured while fetching ' + url + '\n' + e );
            throw new Error( `Category '${categoryId}' could not be fetched.` );
        } );
};

/**
 * Fetch product by ID
 *
 * @param {string} productId
 */
const fetchProduct = ( productId ) => {
    const url = config.product.replace( '$PRODUCT_ID', productId ) + '&expand=availability,images,prices,variations&all_images=true';
    return fetch( url )
        .then( response => response.json() )
        .catch( ( e ) => {
            console.log( 'An error occured while fetching ' + url + '\n' + e );
            throw new Error( `Product '${productId}' could not be fetched.` );
        } );
};

/**
 * Loads search results via OCAPI
 *
 * @param {string} query the search query string
 * @param {object} refinements an object where the keys are the attribute ID to refine by and the values are arrays of refinement values
 */
const fetchSearchResults = ( query, refinements, sortOption ) => {
    // expand options: availability,images,prices,variations,represented_products
    const url = [ config.search, 'expand=availability,images,prices,variations' ];
    url.push( 'q=' + query );
    var index = 1;
    url.push(
        Object.keys( refinements || {} )
            .map( refinementName => {
                if (!refinements[ refinementName ]) {
                    return '';
                }
                return (
                    'refine_' +
                    index++ +
                    '=' +
                    refinementName +
                    '=' +
                    refinements[ refinementName ].join( '|' )
                );
            } )
            .join( '&' )
    );
    if (sortOption) {
        url.push( 'sort=' + sortOption );
    }
    return fetch( url.join( '&' ) )
        .then( response => response.json() )
        .catch( ( e ) => {
            console.log( 'An error occured while fetching ' + url.join( '&' ) + '\n' + e );
            throw new Error( 'Search results could not be fetched.' );
        } );
};

const fetchNewJWT = () => {
    const url = config.customerauth;
    return fetch( url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify( {
            type: 'guest'
        } )
    } )
        .then( response => response )
        .catch( ( e ) => {
            console.log( 'An error occured while fetching ' + url + '\n' + e );
            throw new Error( 'JWT token could not be created' );
        } );
};

const refreshJWT = ( jwt ) => {
    const url = config.customerauth;
    return fetch( url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': jwt
        },
        body: JSON.stringify( {
            type: 'guest'
        } )
    } )
        .then( response => response )
        .catch( ( e ) => {
            console.log( 'An error occured while fetching ' + url + '\n' + e );
            throw new Error( 'JWT token could not be refreshed' );
        } );
};

export {
    fetchSearchResults, fetchContents, fetchCategory, fetchProduct,
    fetchNewJWT, refreshJWT
};
