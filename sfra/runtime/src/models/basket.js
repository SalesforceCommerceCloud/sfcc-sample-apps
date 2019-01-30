import { createBasket, addProduct, removeItem, setItemAttribute } from '../data/store/basket.js';
import { withAuthentication } from '../data/Authentication';


const getCurrentBasket = () => {
  if (typeof sessionStorage != 'undefined' && sessionStorage.getItem('basket')) {
    return JSON.parse(sessionStorage.getItem('basket'));
  } else {
    return null;
  }
};

const setBasket = (basket) => {
  sessionStorage.setItem('basket', JSON.stringify(basket));
};

const withBasket = (callback) => {
  return withAuthentication(() => {
    if (getCurrentBasket('basket')) {
      return callback();
    } else {
      return initializeBasket()
        .then(callback);
    }
  });
};

/**
 * creates and sets new basket
 */
const initializeBasket = () => {
  return withAuthentication(() => {
    return createBasket()
      .then(json => {
        if (json._type === 'basket') {
          setBasket(json);
        } else {
          console.log('Coudn\'t create basket');
          console.log(JSON.stringify(json));
        }
      });
  });
};

/**
 * add product to basket and updates basket
 * always adds _1_ product
 */
const addProductToBasket = (pid, quantity) => {
  return withBasket(() => {

    const basket = getCurrentBasket();

    return addProduct(basket.basket_id, pid, quantity)
      .then(json => {
        if (json._type === 'basket') {
          setBasket(json);
        } else {
          throw Error('Error trying to add product ' + pid // debug message for development
            + ' to basket + ' + basket.basket_id
            + ' expected _type === basket, but received' + JSON.stringify(json));
        }
      })
      .catch(e => {
        console.log('Coudn\'t fetch add product ' + pid + ' to basket.' + e.message);
        throw e;
      });
  });
};

/**
 * add product to basket and updates basket
 * always adds _1_ product
 */
const removeItemFromBasket = (itemID) => {

  return withBasket(() => {

    const basket = getCurrentBasket();

    return removeItem(basket.basket_id, itemID)
      .then(json => {
        if (json._type === 'basket') {
          setBasket(json);
        } else {
          console.log('Error trying to remove product ' + itemID // debug message for development
            + ' from basket + ' + basket.basket_id
            + ' expected _type === basket, but received' + JSON.stringify(json));
        }
      })
      .catch(e => {
        console.log('Coudn\'t fetch add product ' + itemID + ' to basket.' + e.message);
        throw e;
      });
  });
};

const setQuantityOfItem = (itemID, quantity) => {
  return withBasket(() => {

    const basket = getCurrentBasket();

    return setItemAttribute(basket.basket_id, itemID, 'quantity', quantity)
      .then(json => {
        if (json._type === 'basket') {
          setBasket(json);
        } else {
          console.log('Error trying to update quantity of item ' + itemID // debug message for development
            + ' from basket + ' + basket.basket_id
            + ' expected _type === basket, but received' + JSON.stringify(json));
        }
      })
      .catch(e => {
        console.log('Coudn\'t fetch add product ' + itemID + ' to basket. ' + e.message);
        throw e;
      });
  });
};

export { getCurrentBasket, setBasket, addProductToBasket, removeItemFromBasket, setQuantityOfItem };