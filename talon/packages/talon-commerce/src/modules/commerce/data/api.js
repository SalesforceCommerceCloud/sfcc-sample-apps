const APP_API_INSTANCE = 'rsa-inside-ap02-dw.demandware.net'
const APP_API_SITE_ID = 'MobileFirst'
const APP_API_CLIENT_ID = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

const BASE_URL = `https://${APP_API_INSTANCE}/s/${APP_API_SITE_ID}/dw/shop/v18_8/`;

export default {
  content: `${BASE_URL}content/($CONTENT_IDs)?client_id=${APP_API_CLIENT_ID}`,
  search: `${BASE_URL}product_search?client_id=${APP_API_CLIENT_ID}`,
  category: `${BASE_URL}categories/$CATEGORY_ID?client_id=${APP_API_CLIENT_ID}`,
  product: `${BASE_URL}products/$PRODUCT_ID?client_id=${APP_API_CLIENT_ID}`,
  customerauth: `${BASE_URL}customers/auth?client_id=${APP_API_CLIENT_ID}`,
  baskets: `${BASE_URL}baskets/$BASKET_ID/$METHOD?client_id=${APP_API_CLIENT_ID}`
};



