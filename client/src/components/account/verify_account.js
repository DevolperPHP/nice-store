import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios'
import Loading from '../main/loading';
import '../../style/account/verify_account.css'
export default function VerifyAccount() {
    const [errMsg, setErrMsg] = useState('');
    const [succMsg, setSuccMsg] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const { token } = useParams();
    const history = useHistory()
    const handleSubmit = async e => {
        e.preventDefault();
        const url = `${process.env.REACT_APP_SERVER_URL}/verify/account/${token}`;
        const data = {
            verifyCode,
        }
        const res = await axios.put(url, data, { withCredentials: true });
        if (res.data.done) history.push('/login')
        else {
            setSuccMsg('')
            setErrMsg(res.data.errMsg)
        }
    };
    const handleSendVerifyEmail = async () => {
        const url = `${process.env.REACT_APP_SERVER_URL}/send/verify/email`;
        const data = {
            verifyCode,
        }
        const res = await axios.post(url, data, { withCredentials: true });
        if (!res.data.done) {
            setSuccMsg('')
            setErrMsg(res.data.errMsg)
        }
    };
    return (
        <section className="verify-account-section">
            <form onSubmit={handleSubmit}>
                {succMsg && <h4>{succMsg}</h4>}
                {errMsg && <h4>{errMsg}</h4>}
                <label htmlFor="" style={{ width: '100%' }}>
                    <p>Verify Code</p>
                    <input type="text" onChange={e => setVerifyCode(e.target.value)} />
                    <button type="submit">Verify</button>
                </label>
            </form>
            <div className="resend-container">
                <button
                    onClick={handleSendVerifyEmail}
                    style={{ marginTop: '0px' }}>
                    Resend Verify Code
                </button>
            </div>
        </section>
    )
}
