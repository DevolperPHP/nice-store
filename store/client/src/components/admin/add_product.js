import axios from 'axios'
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '../../style/admin/add_product.css';
import Footer from '../main/footer.js'
import { getCategories } from '../../redux/actions/categories';
import Loading from '../main/loading';
export default function AddProduct() {
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('')
    const [image, setImage] = useState(null)
    const [sliderImages, setSliderImages] = useState(null);
    const [desc, setDesc] = useState(null);
    const [shortDesc, setShortDesc] = useState(null);
    const [qty, setQty] = useState(1);
    const [price, setPrice] = useState(1);
    const [addedScore, setAddedScore] = useState(1);
    const [discountScorePercentage, setDiscountScorePercentage] = useState(1);
    const [discountScorePoints, setDiscountScorePoints] = useState(1)
    const [errMsg, setErrMsg] = useState('');
    const [discountScoreActive, setDiscountScoreActive] = useState(false);
    const disptach = useDispatch();
    useEffect(() => {
        disptach(getCategories())
    }, []);
    const reducer = useSelector(state => state.categoriesReducer);
    if (reducer.loading) return (<Loading />);
    const categories = reducer.categories;
    const handleSubmit = (e) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('title', title);
        fd.append('category', category);
        fd.append('image', image);
        for (let i = 0; i < sliderImages?.length; i++) fd.append('sliderImages', sliderImages[i]);
        fd.append('qty', qty);
        fd.append('price', price);
        fd.append('addedScore', addedScore);
        fd.append('discountScorePercentage', discountScorePercentage)
        fd.append('discountScorePoints', discountScorePoints)
        fd.append('discountScoreActive', discountScoreActive)
        fd.append('desc', desc);
        fd.append('shortDesc', shortDesc);
        const url = `${process.env.REACT_APP_SERVER_URL}/add/product`;
        axios.post(url, fd, { withCredentials: true })
            .then(res => {
                if (!res.data.done) {
                    setErrMsg(res.data.errMsg)
                }
                else (<Redirect to="/account"/>)
            })
    };
    return (
        <section className="add-product-section" style={{height: '106vh',}}>

            <div className="max-add-product">
                <form onSubmit={handleSubmit} encType="multipart/form-data" style={{marginTop:'20px'}}>
                    <div className="sections-header">
                        <h1>Add Product</h1>
                    </div>
                    {errMsg ? <p style={{ color: 'tomato', fontSize: 'larger' }}>{errMsg}</p> : ''}
                    <div className="fileds">

                        <label htmlFor="">
                            <p>Title</p>
                            <input type="text" onChange={(e) => setTitle(e.target.value)} />
                        </label>

                        <label htmlFor="">
                            <p>Category</p>
                            <select onChange={(e) => setCategory(e.target.value)}>
                                <option>Choose Category</option>
                                <optgroup label="Main Categories">
                                    {categories.map(({ title, _id, type }) =>
                                        type ? <option value={title} key={_id}>{title}</option> : ''
                                    )}
                                </optgroup>

                                <optgroup label="Secondary Categories">
                                    {categories.map(({ title, _id, type }) =>
                                        !type ? <option value={title} key={_id}>{title}</option> : ''
                                    )}
                                </optgroup>
                            </select>
                        </label>

                        <label htmlFor="">
                            <p>Quantity</p>
                            <input type="number" min="1" value={qty} onChange={(e) => setQty(parseInt(e.target.value))} />
                        </label>

                        <label htmlFor="">
                            <p>Price</p>
                            <input type="number" min="1" value={price} onChange={(e) => setPrice(parseInt(e.target.value))} />
                        </label>

                        <label htmlFor="">
                            <p>Added Score</p>
                            <input type="number" min="1" value={addedScore} onChange={(e) => setAddedScore(parseInt(e.target.value))} />
                        </label>

                        <label htmlFor="">
                            <p>Points to Make The Discount</p>
                            <input type="number" min="1" value={discountScorePoints} onChange={(e) => setDiscountScorePoints(parseInt(e.target.value))} />
                        </label>

                        <label htmlFor="">
                            <p>Discount Percentage With Points</p>
                            <input type="number" min="1" value={discountScorePercentage} onChange={(e) => setDiscountScorePercentage(parseInt(e.target.value))} />
                        </label>

                        <label htmlFor="" style={{ display: 'flex', width: '80%' }}>
                            <p>Active discount With Score</p>
                            <input type="checkbox" onChange={(e) => setDiscountScoreActive(e.target.checked)} />
                        </label>

                        <label htmlFor="">
                            <p>Image</p>
                            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                        </label>

                        <label htmlFor="">
                            <p>Slider Images</p>
                            <input type="file" multiple onChange={(e) => setSliderImages(e.target.files)} />
                        </label>

                        <label htmlFor="">
                            <p>Long Description</p>
                            <CKEditor
                                editor={ClassicEditor}
                                data={desc}
                                onChange={(e, editor) => setDesc(editor.getData())}
                            />
                        </label>
                        <label htmlFor="" style={{ marginLeft: '10px' }}>
                            <p>Short Description (Max 97)</p>
                            <CKEditor
                                editor={ClassicEditor}
                                data={shortDesc}
                                onChange={(e, editor) => setShortDesc(editor.getData())}
                            />
                        </label>

                    </div>
                    <button type="submit">Add</button>
                </form>
            </div>
            <Footer />
        </section>
    )
}
