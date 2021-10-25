import { types } from "../actions/types"
const initialState = {
    products: [],
    loading: true,
}
export const productsReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case types.PRODUCTS_LODAED:
            return {
                ...state,
                products: payload,
                loading: false,
            }
        case types.SEARCH_START:
            return {
                ...state,
                loading:true
            }
        case types.SEARCH_END:
            return {
                ...state,
                products: payload,
                loading: false,
            }
        default:
            return state
    }
}