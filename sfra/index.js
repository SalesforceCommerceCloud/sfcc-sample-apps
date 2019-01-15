
// Services
import {logger} from './logger'

// Extensions
import {wishList} from './wishlist'

export const defaultModules = {
    extensions: {
        'wishlist': [wishList],
        //'payment': [fakePayment]
    },
    services: {
        'logger': [logger]
    }
}