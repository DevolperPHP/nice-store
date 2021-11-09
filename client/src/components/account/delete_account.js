import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import '../../style/account/verify_account.css';
export default function DeleteAccount({ userReducer }) {
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState(false);
    const {token} = useParams();
    const history = useHistory();
    const handleDelete = async (e) => {
        e.preventDefault()
        const url = `${process.env.REACT_APP_SERVER_URL}/confirm/delete/${token}`;
        const res = await axios.post(url, { password }, { withCredentials: true });
        if (!res.data.done) setErrMsg(res.data.errMsg);
        else history.push('/');
    }
    return (
        <section className="verify-account-section">
            <form onSubmit={handleDelete}>
                {errMsg}
                <label htmlFor="">
                    <p>Enter Password to confirm deleting</p>
                    <input type="text" onChange={e => setPassword(e.target.value)} />
                    <button type="submit">Delete</button>
                </label>
                
            </form>
        </section>
    )
}
