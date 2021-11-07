import { types } from './types'
import axios from 'axios';
export const getUser = () => dispatch => {
    dispatch({type:types.USER_LOADING})
    const url = `${process.env.REACT_APP_SERVER_URL}/user`;
    axios(url , {withCredentials:true})
        .then(res => {
            dispatch({ type: types.USER_LODAED , payload: res.data})
        })
        .catch(err =>  dispatch({ type: types.USER_ERR }))
}