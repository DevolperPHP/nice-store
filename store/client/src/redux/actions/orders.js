import axios from "axios";
import { types } from "./types";

export const getOrders = (query) => async dispatch => {
    const url = `${process.env.REACT_APP_SERVER_URL}/admin/orders?finished=${query.finished}&canceled=${query.canceled}`;
    const res = await axios(url, { withCredentials: true });
    dispatch({ type: types.ORDERS_LOADED, payload: res.data });
}
export const searchOrders = (id, query) => async dispatch => {
    const url = `${process.env.REACT_APP_SERVER_URL}/search/order?_id=${id}&finished=${query.finished}&canceled=${query.canceled}`;
    axios(url, { withCredentials: true })
        .then(res => {
            console.log(res);
            dispatch({ type: types.SEARCH_ORDER, payload: res.data });
        })
}
