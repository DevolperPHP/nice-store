import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "../../style/pages/register.css";
import Loading from "../main/loading";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [address, setAddress] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [succMsg, setSuccMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_SERVER_URL}/register`;
    const data = {
      name,
      email,
      password,
      phone,
      governorate,
      address,
    };
    const res = await axios.post(url, data, { withCredentials: true });
    if (res.data.done) {
      setSuccMsg(res.data.succMsg);
      setErrMsg("");
    } else {
      setErrMsg(res.data.errMsg);
      setSuccMsg("");
    }
  };
  if (loading) return <Loading />;
  return (
    <section className="register-section">
      <form onSubmit={handleSubmit}>
        {errMsg ? (
          <p
            style={{ color: "#e74c3c", fontSize: "large", fontWeight: "bold" }}
          >
            {errMsg}
          </p>
        ) : (
          ""
        )}
        {succMsg ? (
          <p
            style={{ color: "#1E90FF", fontSize: "large", fontWeight: "bold" }}
          >
            {succMsg}
          </p>
        ) : (
          ""
        )}
        <label htmlFor="">
          <span>Name</span>
          <input type="text" onChange={(e) => setName(e.target.value)} />
        </label>

        <label htmlFor="">
          <span>Email</span>
          <input type="text" onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label htmlFor="">
          <span>Governorate</span>
          <select onChange={(e) => setGovernorate(e.target.value)}>
            <option>Select Governorate</option>
            <option value="Anbar">Anbar</option>
            <option value="Babil">Babil</option>
            <option value="Baghdad">Baghdad</option>
            <option value="Basra">Basra</option>
            <option value="Dhi Qar">Dhi Qar</option>
            <option value="Al-Qadisiyah">Al-Qadisiyah</option>
            <option value="Diyala">Diyala</option>
            <option value="Duhok">Duhok</option>
            <option value="Erbil">Erbil</option>
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
          <span>Specifec Address</span>
          <textarea onChange={(e) => setAddress(e.target.value)}></textarea>
        </label>

        <label htmlFor="">
          <span>Password</span>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label htmlFor="">
          <span>Phone</span>
          <input type="number" onChange={(e) => setPhone(e.target.value)} />
        </label>
        <div style={{ width: "100%", marginTop: "10px" }}>
          <button type="submit">Register</button> <a href="/login">Login</a>
        </div>
      </form>
    </section>
  );
}
