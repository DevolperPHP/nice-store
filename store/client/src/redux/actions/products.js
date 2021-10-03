import axios from "axios";
import { types } from "./types";

export const getProducts = (sort) => dispatch => {
    const url = `${process.env.REACT_APP_SERVER_URL}/products?sort=${sort ? sort : 'default'}`;
    axios(url, { withCredentials: true })
        .then(res => {
            dispatch({
                type: types.PRODUCTS_LODAED,
                payload: res.data,
            });
        }).catch(err => console.log(err));
}
export const searchProducts = (searchQuery) => dispatch => {
    dispatch({type:types.SEARCH_START})
    const url = `${process.env.REACT_APP_SERVER_URL}/search?title=${searchQuery}`;
    axios(url)
        .then(res => {
            dispatch({ type: types.SEARCH_END, payload: res.data });
        })
}
