import React, { useState, useEffect } from 'react'
import axios from 'axios';
import '../../style/account/edit_account.css'
import { Redirect, useHistory } from 'react-router-dom';
export default function EditAccount({ userReducer }) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [governorate, setGovernorate] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const { user } = userReducer;
    const history = useHistory();
    useEffect(() => {
        setName(user.name);
        setEmail(user.email);
        setAddress(user.address);
        setGovernorate(user.governorate);
    }, [])
    const handleEdit = async (e) => {
        e.preventDefault();
        const url = `${process.env.REACT_APP_SERVER_URL}/edit/account`;
        const newData = {
            name,
            password,
            email,
            address,
            governorate,
        };
        const { data } = await axios.put(url, newData, { withCredentials: true });
        if (data.done) history.push('/account')
        else setErrMsg(data.errMsg);
    }
    return (
        <section className="edit-account-section">
            <form onSubmit={handleEdit}>
                {
                errMsg 
                && 
                <div style={{width:'100%'}}>
                    <p style={{color:'tomato', fontSize:'1.4rem'}}>{errMsg}</p>
                </div>
                }
                <label htmlFor="">
                    <p>Name</p>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </label>
                <label htmlFor="">
                    <p>Email</p>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label htmlFor="">
                    <p>Governorate</p>
                    <select onChange={(e) => setGovernorate(e.target.value)} value={user.governorate}>
                        <option>Select Governorate</option>
                        <option value="Anbar">Anbar</option>
                        <option value="Babil">Babil</option>
                        <option value="Baghdad">Baghdad</option>
                        <option value="Basra">Basra</option>
                        <option value="Dhi Qar">Dhi Qar</option>
                        <option value="Al-Qadisiyah">Al-Qadisiyah</option>
                        <option value="Diyala">Diyala</option>
                        <option value="Duhok">Duhok</option><option value="Erbil">Erbil</option>
                        <option value="Karbala">Karbala</option>
                        <option value="Kirkuk">Kirkuk</option>
                        <option value="Maysan">Maysan</option>
                        <option value="Muthanna">Muthanna</option>
                        <option value="Najaf">Najaf</option>
                        <option value="Nineveh">Nineveh</option>
                        <option value="Saladin">Saladin</option>
                        <option value="Sulaymaniyah">Sulaymaniyah</option>
                        <option value="Wasit">Wasit</option>
                    </select>
                </label>
                <label htmlFor="">
                    <p>Address</p>
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)}></textarea>
                </label>
                <label htmlFor="">
                    <p>Password <sub style={{ opacity: '.9' }}>(required)</sub></p>
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)} />
                </label>
                <label htmlFor="">
                    <button type="submit">Edit</button>
                </label>
            </form>
        </section>
    )
}
