import { combineReducers} from "redux";
import { productsReducer} from "./products";
import {categoriesReducer} from "./categories"
import {userReducer} from "./user"
const reducers = combineReducers({
    productsReducer,
    userReducer,
    categoriesReducer,
})
export default reducers