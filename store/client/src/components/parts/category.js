import React, { useEffect } from "react";
import "../../style/parts/category.css";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge } from "@fortawesome/free-solid-svg-icons";
import { getCategories } from "../../redux/actions/categories";
import Loading from "../main/loading";
import axios from "axios";

export default function Category({ userReducer }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCategories());
  }, []);
  const reducer = useSelector((state) => state.categoriesReducer);
  if (reducer.loading) return <Loading />;
  const categories = reducer.categories;
  const deleteCategory = async (e) => {
    const check = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (check) {
      const id = e.target.value;
      const { data } = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/delete/category/${id}`,
        { withCredentials: true }
      );
    }
  };
  return (
    <section className="category-section">
      <div className="category-header">
        <h1>Our Main Categories </h1>
        <FontAwesomeIcon icon={faThLarge} />
      </div>

      <div className="grid-items">
        {categories.map(({ title, _id, path }) => (
          <div key={_id} className="sizing-category" key={_id}>
            <a href={`/category/${path}`}>{title}</a>
            {userReducer.isLogin && userReducer.user.isAdmin && (
              <button onClick={deleteCategory} value={_id}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
