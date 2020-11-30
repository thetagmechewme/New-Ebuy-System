import {couponConst} from '../actions/constants';

export const couponReducer = (state = false, action) => {
    switch (action.type) {
        case couponConst.COUPON_APPLIED:
            return action.payload;
        default:
            return state;
    }
};
