import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Redirect, useParams } from 'react-router-dom';
export default function DeleteAccount({ userReducer }) {
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState(false);
    const {token} = useParams()
    const handleDelete = async (e) => {
        e.preventDefault()
        const url = `${process.env.REACT_APP_SERVER_URL}/confirm/delete/${token}`;
        const res = await axios.post(url, { password }, { withCredentials: true });
        if (!res.data.done) setErrMsg(res.data.errMsg);
        else <Redirect to="/" />
    }
    return (
        <section className="delete-account-section">
            <form onSubmit={handleDelete}>
                {errMsg}
                <label htmlFor="">
                    <p>Write Your Password to confirm deleting</p>
                    <input type="text" onChange={e => setPassword(e.target.value)} />
                </label>
                <button type="submit">Delete</button>
            </form>
        </section>
    )
}
