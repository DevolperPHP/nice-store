import { types } from "../actions/types"

const initialState = {
    orders: [],
    loading: true,
}

export const ordersReducer = (state = initialState, {type, payload}) => {
    switch(type) {
        case types.ORDERS_LOADED:
            return {
                ...state,
                orders:payload.orders,
                loading:false
            }
        default:
            return state
    }
}