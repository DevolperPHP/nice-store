import { types } from "../actions/types"
const initialState = {
    categories:[],
    loading:false,
}
export const categoriesReducer = (state = initialState , {type , payload}) => {
    switch(type) {
        case types.CATEGORIES_LOADING: 
            return {
                ...state,
                loading:true
            }
        case types.CATEGORIES_LOADED: 
            return {
                ...state,
                categories:payload,
                loading:false
            }
        default:
            return state
    }
}