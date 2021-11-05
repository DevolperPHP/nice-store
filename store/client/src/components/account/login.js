import React, {useEffect ,  useState } from 'react'
import { useHistory } from 'react-router-dom';
import '../../style/account/login.css';
export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `${process.env.REACT_APP_SERVER_URL}/login`;
        const data = {
            email,
            password,
        };
        const config = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include'
        }
        fetch(url, config)
            .then(res => res.json())
            .then(res => {
                if (!res.done) setErrMsg(res.errMsg);
                else history.push('/');
            })
            .catch(err => console.log(err))
    }
    return (
        <section className="login-section">
            <form onSubmit={handleSubmit}>
                
                {errMsg ? <p>{errMsg}</p> : ''}
                <label htmlFor="">
                    <span>Email</span>
                    <input type="text" onChange={(e) => setEmail(e.target.value)}/>
                </label>

                <label htmlFor="">
                    <span>Password</span>
                    <input type="password" onChange={(e) => setPassword(e.target.value)}/>
                </label>
                <div>
                    <button type="submit">Login</button>
                    <a href="/register">Register</a>
                </div>
            </form>
        </section>
    )
}
