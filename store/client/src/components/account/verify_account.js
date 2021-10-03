import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import Loading from '../main/loading';
export default function VerifyAccount() {
    const [errMsg, setErrMsg] = useState('');
    const [succMsg, setSuccMsg] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false)
    const { token } = useParams();
    const handleSubmit = async () => {
        setLoading(true)
        const url = `${process.env.REACT_APP_SERVER_URL}/verify/account/${token}`;
        const data = {
            email,
        }
        const res = await axios.post(url, data, { withCredentials: true });
        setLoading(false);
        if (res.data.done) <Redirect to="/login" />
        else {
            setSuccMsg('')
            setErrMsg(res.data.errMsg)
        }
    };
    const handleSendVerifyEmail = async () => {
        setLoading(true)
        const url = `${process.env.REACT_APP_SERVER_URL}/send/verify/email`;
        const data = {
            email,
        }
        const res = await axios.post(url, data, { withCredentials: true });
        setLoading(false)
        if (res.data.done) <Redirect to="/login"/>
        else {
            setSuccMsg('')
            setErrMsg(res.data.errMsg)
        }
    };
    if (loading) return (<Loading/>)
    return (
        <section>
            <form onSubmit={handleSubmit}>
                {succMsg && <h4>{succMsg}</h4>}
                {errMsg && <h4>{errMsg}</h4>}
                <label htmlFor="">
                    <p>Write Your Email</p>
                    <input type="text" placeholder="user@example.com" onChange={e => setEmail(e.target.value)} />
                </label>
                <button type="submit">Verify</button>
            </form>
            <form onSubmit={handleSendVerifyEmail}>
                <button type="submit">Resend Verify code</button>
            </form>
        </section>
    )
}
