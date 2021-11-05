import { combineReducers } from "redux";
import { productsReducer } from "./products";
import { categoriesReducer } from "./categories"
import { ordersReducer } from "./orders"
import { userReducer } from "./user"
const reducers = combineReducers({
    productsReducer,
    userReducer,
    categoriesReducer,
    ordersReducer,
})
export default reducers