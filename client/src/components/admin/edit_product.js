import axios from 'axios';
import { Redirect } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '../../style/admin/add_product.css';
import Footer from '../main/footer.js'
import { getCategories } from '../../redux/actions/categories';
import Loading from '../main/loading';
export default function EditProduct({ match }) {
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
    const [discountErrMsg, setDiscountErrMsg] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [checkDiscount, setCheckDiscount] = useState(false);
    const [productActive, setProductActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState('');
    const { path } = useParams();
    const history = useHistory();
    const disptach = useDispatch();
    useEffect(() => {
        disptach(getCategories());
        axios(`${process.env.REACT_APP_SERVER_URL}/product/${path}`)
            .then(res => {
                if (res.data.done) {
                    const product = res.data.product
                    setTitle(product.title);
                    setPrice(product.price);
                    setCategory(product.category)
                    setDesc(product.desc);
                    setShortDesc(product.shortDesc);
                    setQty(product.qty);
                    setAddedScore(product.addedScore);
                    setDiscountScorePercentage(product.discountScore.percentage);
                    setDiscountScorePoints(product.discountScore.points)
                    setCheckDiscount(product.discount);
                    setDiscountScoreActive(product.discountScoreActive);
                    setImage(product.image);
                    setSliderImages(product.slider);
                    setId(product._id);
                    setProductActive(product.active);
                    setLoading(false);
                }
            })
    }, []);
    const reducer = useSelector(state => state.categoriesReducer);
    if (reducer.loading || loading) return (<Loading />);
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
        fd.append('active', productActive);
        const url = `${process.env.REACT_APP_SERVER_URL}/edit/product/${id}`;
        axios.put(url, fd, { withCredentials: true })
            .then(res => {
                if (!res.data.done) {
                    setErrMsg(res.data.errMsg)
                }
                else history.push('/admin/panel')
            })
    };
    const cancleDiscount = (e) => {
        e.preventDefault()
        const url = `${process.env.REACT_APP_SERVER_URL}/cancle/discount/${id}`;
        axios.put(url, {}, { withCredentials: true })
            .then(res => {
                if (!res.data.done) setErrMsg(res.data.errMsg)
            })
    };
    const addDiscount = (e) => {
        e.preventDefault()
        const url = `${process.env.REACT_APP_SERVER_URL}/discount/product/${id}`
        axios.put(url, { discount: discountPercentage }, { withCredentials: true })
            .then(res => {
                if (!res.data.done) setDiscountErrMsg(res.data.errMsg)
                else history.push('/products')
            })
    };
    const handleRemoveSlider = async (e) => {
        e.preventDefault()
        const url = `${process.env.REACT_APP_SERVER_URL}/remove/slider/${id}`;
        const res = await axios.put(url, {}, { withCredentials: true });
        console.log(res);
    }
    return (
        <section className="edit-product-section">
            <div className="max-add-product">
                <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ marginTop: '20px' }}>
                    <div className="sections-header">
                        <h1>Edit Product</h1>
                    </div>

                    {errMsg ? <p style={{ color: 'tomato', fontSize: 'larger' }}>{errMsg}</p> : ''}
                    <div className="fileds">

                        <label htmlFor="">
                            <p>Title</p>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
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
                            <input type="number" value={qty} onChange={(e) => setQty(parseInt(e.target.value))} />
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

                        <label htmlFor="" style={{ width: '80%' }}>
                            <p>Active discount With Score</p>
                            {
                                discountScoreActive
                                    ?
                                    <div
                                        onClick={() => setDiscountScoreActive(false)}
                                        style={{
                                            width: '20%',
                                            height: '30px',
                                            background: '#1E90FF',
                                            textAlign: 'center',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}>
                                        true
                                    </div>
                                    :
                                    <div
                                        onClick={() => setDiscountScoreActive(true)}
                                        style={{
                                            width: '20%',
                                            height: '30px',
                                            background: 'tomato',
                                            textAlign: 'center',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}>
                                        False
                                    </div>
                            }
                        </label>

                        <label htmlFor="" style={{ width: '80%' }}>
                            <p>Active Product</p>
                            {
                                productActive
                                    ?
                                    <div
                                        onClick={() => setProductActive(false)}
                                        style={{
                                            width: '20%',
                                            height: '30px',
                                            background: '#1E90FF',
                                            textAlign: 'center',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}>
                                        true
                                    </div>
                                    :
                                    <div
                                        onClick={() => setProductActive(true)}
                                        style={{
                                            width: '20%',
                                            height: '30px',
                                            background: 'tomato',
                                            textAlign: 'center',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}>
                                        False
                                    </div>
                            }
                        </label>
                        <label htmlFor="">
                            <p>Image</p>
                            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                        </label>

                        <label htmlFor="">
                            <p>Slider Images</p>
                            <input type="file" multiple onChange={(e) => setSliderImages(e.target.files)} />
                        </label>
                        <div></div>
                        <label htmlFor="">
                            <p>Long Description</p>
                            <CKEditor
                                editor={ClassicEditor}
                                data={desc}
                                onChange={(e, editor) => setDesc(editor.getData())}
                            />
                        </label>
                        <div className="break-element"></div>
                        <label htmlFor="" className="short-desc-container">
                            <p>Short Description (Max 97)</p>
                            <CKEditor
                                editor={ClassicEditor}
                                data={desc}
                                onChange={(e, editor) => setShortDesc(editor.getData())}
                            />
                        </label>

                    </div>
                    <button type="submit" style={{ marginTop: '20px' }}>Edit</button>
                </form>

                <div className="next-forms">
                    {discountErrMsg && <p style={{ color: 'tomato', fontSize: 'larger' }}>{discountErrMsg}</p>}
                    <div className="fileds" style={{ alignItems: 'center' }}>
                        <label htmlFor="">
                            <p style={{color:'#f4f4f4'}}>Discount Percenteg</p>
                            <input type="number" min="1" onChange={(e) => setDiscountPercentage(Number(e.target.value))} />
                            <div></div>
                            <button style={{ marginTop: '20px' }} onClick={addDiscount}>Add Discount</button>
                            {
                                checkDiscount
                                    ?
                                    <button
                                        style={{
                                            background: 'tomato',
                                            marginTop: '20px',
                                            marginLeft: '10px'
                                        }}
                                        onClick={cancleDiscount}>
                                        Cancle Discount
                                    </button>
                                    :
                                    ''
                            }
                        </label>

                    </div>
                </div>
                <div className="next-forms">
                    <form onSubmit={handleRemoveSlider} style={{ width: '100%', }}>
                        <div className="fileds">
                            <label htmlFor="">
                                <p>Remove Slider</p>
                                <button
                                    type="submit"
                                    style={{
                                        background: 'tomato',
                                        marginTop: '20px'
                                    }}>
                                    Remove
                                </button>
                            </label>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </section>
    )
}



