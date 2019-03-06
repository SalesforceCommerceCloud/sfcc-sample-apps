import { fetchNewJWT, refreshJWT } from './store.js';
import { deleteBasket, createBasketFromBasket } from './store/basket.js';
import { getCurrentBasket, setBasket } from '../models/basket.js';


const getCurrentJWT = () => {
  return sessionStorage.getItem('jwt');
};

const setJWT = (jwt) => {
  sessionStorage.setItem('jwt', jwt);
};

const withAuthentication = (callback) => {

  // if jwt currently doesn't exist, create it then execute callback
  if (!getCurrentJWT('jwt')) {
    return newAuth().then(callback);
  }

  return callback()
    .catch(e => {
      if (e.message === 'Failed to fetch' && e.stack === 'TypeError: Failed to fetch') {   // jwt is expired
        return refreshAuth().then(callback);
      } else {
        throw e;
      }
    });
};

/**
 * gets a new jwt and sets it too
 */
const newAuth = () => {
  return fetchNewJWT()
    .then(response => {
      const jwt = response.headers.get('Authorization');
      if (jwt) {
        setJWT(jwt);
      } else {
        throw new Error('Coudn\'t get jwt from ' + JSON.stringify(response));
      }
    })
    .catch(e => {
      console.log('Coudn\'t fetch JWT');
      throw e;
    });
};

/**
 * should be called when the current jwt is expired. 
 * refreshes jwt and everything related to it.
 */
const refreshAuth = () => {
  return refreshJWT()
    .then(response => {
      const newJWT = response.headers.get('Authorization');
      if (newJWT) {
        return rebuildRelated(newJWT);
      } else {
        throw new Error('Coudn\'t get jwt from ' + JSON.stringify(response));
      }
    })
    .catch(e => {
      console.log('Coudn\'t refresh JWT' + e.message + ', ' + e.stack);
      throw e;
    });
};

/**
 * There are links between the customer (represented by jwt) and the basket.
 * 
 * So when there's a new JWT, the basket needs to be rebuild too.
 * 
 * @param {*} newJWT 
 */
const rebuildRelated = (newJWT) => {
  const prevBasket = getCurrentBasket();
  return (
    deleteBasket(prevBasket.basket_id)    // delete old basket
      .then(() => {
        setJWT(newJWT);
        createBasketFromBasket(prevBasket)   // build a new basket, with the same values as the old basket, except linked to the new jwt
          .then(json => {
            setBasket(json);  // executions from way up in the chain are executed before this
          });
      })
  );
};

export { getCurrentJWT, withAuthentication };