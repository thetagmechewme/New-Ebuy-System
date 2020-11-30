import {searchFilter} from '../actions/constants';

export const searchReducer = (state = { text: '' }, action) => {
    switch (action.type) {
        case searchFilter.SEARCH_QUERY:
            return { ...state, ...action.payload };
        default:
            return state;
    }
}
