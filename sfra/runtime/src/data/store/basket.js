import config from '../../config/api';
import { getCurrentJWT } from '../Authentication';

const getDefaultHeaders = () => {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': getCurrentJWT()
  };
};

const createBasket = () => {
  const url = config.baskets.replace('/$METHOD', '').replace('/$BASKET_ID', '');
  return fetch(url, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify(   // add default shipping method. We need to set a shipping method for totals calculation to work
      {
        'shipments': [
          {
            'shipping_method':
            {
              'id': '001'
            }
          }
        ]
      }
    )
  })
    .then(response => response.json());
};

const createBasketFromBasket = (basket) => {
  const url = config.baskets.replace('/$METHOD', '').replace('/$BASKET_ID', '');
  return fetch(url, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify(basket)
  })
    .then(response => response.json())
    .catch(e => {
      console.log(e.message);
      throw e;
    });
};

const deleteBasket = (basketID) => {
  const url = config.baskets.replace('/$METHOD', '').replace('$BASKET_ID', basketID);
  return fetch(url, {
    method: 'DELETE',
    headers: getDefaultHeaders()
  })
    .then(response => console.log(response))
    .catch(e => {
      console.log(e.message);
      throw e;
    });
};

const addProduct = (basketID, productID, quantity) => {
  const url = config.baskets.replace('$METHOD', 'items').replace('$BASKET_ID', basketID);
  return fetch(url, {
    method: 'POST',
    headers: getDefaultHeaders(),
    body: JSON.stringify([{
      'product_id': productID,
      'quantity': quantity
    }])
  })
    .then(response => response.json());
};

const removeItem = (basketID, itemID) => {
  const url = config.baskets.replace('$METHOD', 'items' + '/' + itemID).replace('$BASKET_ID', basketID);  // eslint-disable-line no-useless-concat
  return fetch(url, {
    method: 'DELETE',
    headers: getDefaultHeaders()
  })
    .then(response => response.json())
    .catch((e) => {
      console.log('An error occured while fetching ' + url + '\n' + e);
      throw new Error('item ' + itemID + ' could not be removed from basket ' + basketID);
    });
};

const setItemAttribute = (basketID, itemID, attrName, attrValue) => {
  const url = config.baskets.replace('$METHOD', 'items' + '/' + itemID).replace('$BASKET_ID', basketID);  // eslint-disable-line no-useless-concat
  return fetch(url, {
    method: 'PATCH',
    headers: getDefaultHeaders(),
    body: JSON.stringify({
      [attrName]: attrValue
    })
  })
    .then(response => response.json())
    .catch((e) => {
      console.log('An error occured while fetching ' + url + '\n' + e);
      throw new Error('Quantity of item ' + itemID + ' in basket ' + basketID + ' could not be set');
    });
};

export { createBasket, createBasketFromBasket, deleteBasket, addProduct, removeItem, setItemAttribute };