import axios from "axios";
import { types } from "./types";

export const getOrders = () => async dispatch => {
    const url = `${process.env.REACT_APP_SERVER_URL}/orders`;
    const res = await axios(url);
    dispatch({type:types.ORDERS_LOADED, payload:res.data});
}   
