import axios from 'axios';
import {types} from './types';

export const getCategories = () => dispatch => {
    dispatch({type:types.CATEGORIES_LOADING});
    const url = `${process.env.REACT_APP_SERVER_URL}/categories`;
    axios(url)
        .then(res => {
            dispatch({type:types.CATEGORIES_LOADED , payload:res.data});
        })
        .catch(err => console.log(err));
}
