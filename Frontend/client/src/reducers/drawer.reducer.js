import {drawerConst} from '../actions/constants';

export const drawerReducer = (state = false, action) => {
    switch (action.type){
        case drawerConst.SET_VISIBLE:
            return action.payload;
        default:
            return state;
    }
};
