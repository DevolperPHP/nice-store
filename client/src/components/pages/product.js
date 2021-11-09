import React, { useEffect, useState, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import ReactHtmlParser from 'react-html-parser';
import Footer from '../main/footer';
import '../../style/pages/product.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTimes, faCartPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faBuffer, } from '@fortawesome/free-brands-svg-icons';
import Loading from '../main/loading';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';
import ProductList from '../parts/product_list';
export default function Product({ userReducer }) {
    const [update, setUpdate] = useState(false)
    const [checkBuyWithPoints, setCheckBuyWithPoints] = useState(false)
    const [productQty, setProductQty] = useState(1);
    const [hover, setHover] = useState(0);
    const [imagePath, setImagePath] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [succMsg, setSuccMsg] = useState('');
    const [screenWidth, setScreenWidth] = useState(0);
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { path } = useParams();
    const history = useHistory();

    useEffect(() => {
        const url = `${process.env.REACT_APP_SERVER_URL}/product/${path}`;
        axios(url)
            .then(res => {
                if (res.data.done) {
                    setProduct(res.data.product)
                    setRelatedProducts(res.data.relatedProducts);
                    setLoading(false)
                }

            })
            .catch(err => console.log(err))
    }, [update]);
    useEffect(() => {
        window.addEventListener('resize', () => {
            setScreenWidth(window.innerWidth)
        })
        return () => {
            window.removeEventListener('resize', setScreenWidth(window.innerWidth), true)
        }
    })
    if (loading) return (<Loading />);
    const {
        title,
        image,
        slider,
        discount,
        desc,
        _id,
        price,
        stars,
        qty,
        discountPrice,
        discountPercentage,
        discountScore,
        discountScoreActive } = product;
    const user = userReducer.user;
    const isLogin = userReducer.isLogin;
    const incrementCount = (e) => {
        e.target.classList.add('btn-sec-active')
        setProductQty(productQty + 1)
        setTimeout(() => e.target.classList.remove('btn-sec-active'), 220)
    }
    const decrementCount = (e) => {
        e.target.classList.add('btn-sec-active-mins')
        if (productQty > 1) setProductQty(productQty - 1);
        setTimeout(() => e.target.classList.remove('btn-sec-active-mins'), 220)
    }
    const handleRanking = (e) => {
        let value;
        const url = `${process.env.REACT_APP_SERVER_URL}/rate/product/${_id}`;
        if (e.target.tagName == 'svg') value = e.target.parentElement.value;
        if (e.target.tagName == 'path') value = e.target.parentElement.parentElement.value;
        if (e.target.tagName == 'BUTTON') value = e.target.value;
        axios.put(url, { value }, { withCredentials: true })
            .then(res => setUpdate(!update))
            .catch(err => console.log(err));
    };
    const handleAddToCart = (e) => {
        const url = `${process.env.REACT_APP_SERVER_URL}/add/cart`;
        const data = {
            productId: _id,
            qty: productQty,
            checkBuyWithPoints,
        }
        axios.put(url, data, { withCredentials: true })
            .then(res => {
                if (res.data.done) {
                    setSuccMsg(res.data.succMsg);
                    document.getElementById('msg-container').style.display = 'flex';
                }
                else {
                    setErrMsg(res.data.errMsg);
                    document.getElementById('err-msg-container').style.display = 'flex';
                }
            })
    };
    const handleDelete = async (e) => {
        const check = window.confirm('Are you sure you want to delete this product');
        if (check) {
            const url = `${process.env.REACT_APP_SERVER_URL}/delete/product/${_id}`;
            const { data } = await axios.delete(url, { withCredentials: true });
            if (data.done) window.history.back();
        }
    };
    if (succMsg) {
        document.addEventListener('click', e => {
            if (e.target.id === '' || e.target.id !== 'msg-container') {
                document.getElementById('msg-container').style.display = 'none';
            }
        })
    }
    else if (errMsg) {
        document.addEventListener('click', e => {
            if (e.target.id === '' || e.target.id !== 'msg-container') {
                document.getElementById('err-msg-container').style.display = 'none';
            }
        })
    }

    const responsive = {
        superLargeScreens: {
            breakpoint: { max: 4000, min: 1024 },
            items: 4,
            slidesToSlide: 3 // optional, default to 1.
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
            slidesToSlide: 4 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };
    return (
        <section className="product-section" >
            <div className="max-product" id="max-product">
                {errMsg ?
                    <div className="msg-container" id="err-msg-container">
                        <header>
                            <p className="msg">{errMsg}</p>
                            <FontAwesomeIcon icon={faTimes} />
                        </header>
                        <div style={{ width: '50%', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                            <a href="/register">Register</a>
                            <a href="/login" style={{ marginLeft: '20px' }}>Login</a>
                        </div>
                    </div>
                    :
                    ''
                }
                {succMsg
                    ?
                    <div className="msg-container" id="msg-container">
                        <header>
                            <p className="msg">{succMsg}</p>
                            <FontAwesomeIcon icon={faTimes} />
                        </header>
                        <div style={{ width: '50%', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                            <a href="/cart">Go To Cart</a>
                            <a href="/products" style={{ marginLeft: '20px' }}>Keep Shopping</a>
                        </div>
                    </div>
                    :
                    ''
                }
                <div className="main-img-container">

                    <div className="main-img">
                        <img
                            src={
                                imagePath
                                    ?
                                    `/images/${imagePath}`
                                    :
                                    `/images/${image}`}
                            alt={title}
                            loading="lazy"
                        />
                    </div>
                    <div className="slider-container">
                        {
                            <Carousel responsive={responsive} pauseOnHover autoPlay={true} autoPlaySpeed={2000} infinite={true}>
                                <img
                                    key={image}
                                    src={`/images/${image}`}
                                    alt='main-image'
                                    onClick={() => setImagePath(image)} />
                                {slider?.map(({ image }) =>
                                    <img
                                        key={image}
                                        src={`/images/${image}`}
                                        alt={title}
                                        onClick={() => setImagePath(image)} />
                                )}
                            </Carousel>
                        }
                    </div>
                </div>
                <div style={{ height: '70%', }} className="show-info">
                    <div className="product-title">
                        <h1>{title} </h1>
                        {
                            isLogin &&
                            user?.isAdmin &&
                            <div>
                                <button
                                    className="edit-btn"
                                    style={{ background: '#f39c12' }}
                                    aria-label="center"
                                    onClick={() => history.push(`/edit/product/${path}`)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="edit-btn"
                                    style={{ background: '#dc0d1b', marginLeft:screenWidth <= 660 && '10px' }}
                                    aria-label="center"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                            </div>

                        }
                    </div>

                    <div className="description">
                        {ReactHtmlParser(desc)}
                    </div>
                    <div className="options-container">
                        {
                            qty < 1
                                ?
                                <h3 style={{ marginRight: '15px' }}>Out Of Stock</h3>
                                :
                                <button
                                    value={_id}
                                    className="btn-prime"
                                    aria-label="left"
                                    onClick={handleAddToCart}>
                                    Add To Cart
                                    <FontAwesomeIcon icon={faCartPlus} />
                                </button>
                        }
                        {
                            qty > 0
                            &&
                            <div className="counter" aria-label="right">
                                <button className="btn-sec" onClick={incrementCount}>+</button>
                                <p>{productQty}</p>
                                <button className="btn-sec" onClick={decrementCount}>-</button>
                            </div>
                        }
                        {
                            qty > 0
                                ?
                                discount
                                    ?
                                    <div style={{ fontSize: 'large', marginLeft: '2%' }}>
                                        <span>{discountPrice}$</span>
                                        <div></div>
                                        <span className="price-element" style={{ fontSize: '15px', }}>Price {price}$</span>
                                        <span className="percentage-element">/ -{discountPercentage}%</span>
                                    </div>
                                    :
                                    <span className="price-tag">{price}$</span>
                                :
                                ''
                        }
                        <div style={{ display: screenWidth <= 1317 ? 'block' : 'none' }}></div>
                        {
                            qty > 0 && discountScoreActive
                            &&
                            <div style={{ display: 'block' }}>
                                <label htmlFor="" className="points-options">
                                    <p>Buy With Points? cost ({discountScore.points})</p>
                                    <button
                                        style={{
                                            background: checkBuyWithPoints ? '#1E90FF' : 'tomato'
                                        }}
                                        onClick={() => setCheckBuyWithPoints(!checkBuyWithPoints)}>
                                        {String(checkBuyWithPoints)}
                                    </button>
                                </label>
                                <div style={{ opacity: '.9' }}>
                                    ({
                                        discount
                                            ?
                                            <span>New Price {Math.floor(discountPrice - (discountPrice * (discountScore.percentage / 100)))}$</span>

                                            :
                                            <span>New Price {Math.floor(price - (price * (discountScore.percentage / 100)))}$</span>
                                    })

                                </div>
                            </div>
                        }
                    </div>
                    <div>

                        {[...Array(5)].map((star, index) => {
                            let totalStars = 0;
                            for (let i = 0; i < stars?.length; i++) {
                                totalStars += stars[i].value;
                            }
                            const rating = totalStars / stars?.length;
                            const rate = index + 1;
                            return (
                                <button
                                    key={rate}
                                    value={rate}
                                    onClick={handleRanking}
                                    aria-label="left"
                                    style={{
                                        outline: 'none',
                                        border: 'none',
                                        background: 'none',
                                    }}>
                                    <FontAwesomeIcon
                                        icon={faStar}
                                        style={{ color: rate <= (hover || rating) ? '#f1c40f' : '#95a5a6' }}
                                        onMouseEnter={e => setHover(rate)}
                                        onMouseLeave={e => setHover(0)}
                                    />
                                </button>
                            )
                        })}
                        <span style={{ marginLeft: '10px' }}>{stars?.length >= 1 ? `${stars?.length} Review` : `${stars?.length} Reviews`} </span>

                    </div>
                </div>
            </div>
            {/*REALTED PRODUCTS SECTION*/}
            <div className="related-products">
                <div className="sections-header">
                    <h1 style={{ color: "#f1f1f1" }}>Related Products</h1>
                    <FontAwesomeIcon icon={faBuffer} style={{ marginLeft: '10px' }} />
                </div>

                <Carousel responsive={responsive} autoPlay={true} autoPlaySpeed={2000} arrows={false} infinite={true}>
                    {
                        relatedProducts.length > 0
                            ?
                            relatedProducts.map(product =>
                                <ProductList product={product} />
                            )
                            :
                            <h3 style={{ color: '#f1f1f1', opacity: '.8' }}>Products Will Arive Soon</h3>
                    }
                </Carousel >
            </div>
            <Footer />
        </section >
    )
}
