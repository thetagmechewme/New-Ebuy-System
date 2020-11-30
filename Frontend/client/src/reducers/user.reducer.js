import {userConst} from '../actions/constants';

export function userReducer(state = null, action){
    switch (action.type){
        case userConst.LOGGED_IN_USER:
            return action.payload;
        case userConst.REGISTER_USER:
            return action.payload;

        case userConst.LOGOUT:
            return action.payload;

        default:
            return state;
    }
}
