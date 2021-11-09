import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "../../style/admin/add_category.css";
export default function AddCategory() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const history = useHistory();
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_SERVER_URL}/add/category`;
    const data = {
      title,
      type,
    };
    axios
      .post(url, data, { withCredentials: true })
      .then((res) => {
        if (res.data.done) history.push("/admin/panel");
        else setErrMsg(res.data.errMsg);
      })
      .catch((err) => console.log(err));
  };
  return (
    <section className="add-category-section">
      <form onSubmit={handleSubmit}>
        {errMsg ? <p>{errMsg}</p> : ""}
        <label htmlFor="">
          <p>Title</p>
          <input type="text" onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label htmlFor="">
          <p>Type</p>

          <select onChange={(e) => setType(e.target.value)}>
            <option>Choose Type</option>
            <option value="true">Main Category</option>
            <option value="false">Secondary Category</option>
          </select>
        </label>
        <label htmlFor="">
          <button type="submit" style={{fontSize:'1rem'}}>Add</button>
        </label>
      </form>
    </section>
  );
}
