import {cashConst} from '../actions/constants';

export const CashOnDeliveryReducer = (state = false, action) => {
    switch (action.type){
        case cashConst.COD:
        return action.payload;
        default:
            return state;
    }
};
