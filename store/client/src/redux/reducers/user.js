import { types } from '../actions/types'
const initialState = {
    user: {},
    loading: true,
    isLogin: false,
}

export const userReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case types.USER_LODAED:
            return {
                ...state,
                user: payload.user,
                isLogin: payload.isLogin,
                loading: false,
            }
        case types.USER_ERR:
            return {
                ...state,
                loading: false,
            }
        default:
            return state
    }
}