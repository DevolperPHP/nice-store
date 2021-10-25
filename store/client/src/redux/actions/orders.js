import axios from "axios";
import { types } from "./types";

export const getOrders = (query) => async dispatch => {
    const url = `${process.env.REACT_APP_SERVER_URL}/admin/orders?finished=${query.finished}&canceled=${query.canceled}`;
    const res = await axios(url, {withCredentials:true});
    dispatch({type:types.ORDERS_LOADED, payload:res.data});
}   
