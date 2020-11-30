import { combineReducers } from 'redux';
import {userReducer} from './user.reducer';
import { searchReducer } from './search.reducer';
import {cartReducer} from './cart.reducer';
import {drawerReducer} from './drawer.reducer';
import {couponReducer} from './coupon.reducer';
import {CashOnDeliveryReducer} from './CashOnDelivery.reducer';

const  rootReducer = combineReducers({
    user: userReducer,
    search: searchReducer,
    cart: cartReducer,
    drawer: drawerReducer,
    coupon: couponReducer,
    COD: CashOnDeliveryReducer,
});
export default rootReducer;
