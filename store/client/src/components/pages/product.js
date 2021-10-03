import React, { useEffect, useState } from 'react'
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
export default function Product({ match, userReducer }) {
    const [update, setUpdate] = useState(false)
    const [checkBuyWithPoints, setCheckBuyWithPoints] = useState(false)
    const [productQty, setProductQty] = useState(1);
    const [hover, setHover] = useState(0);
    const [imagePath, setImagePath] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [succMsg, setSuccMsg] = useState('');
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const { path } = useParams();
    const history = useHistory();
    useEffect(() => {
        const url = `${process.env.REACT_APP_SERVER_URL}/product/${path}`;
        axios(url)
            .then(res => {
                console.log(res.data)
                if (res.data.done) {
                    setProduct(res.data.product)
                    setRelatedProducts(res.data.relatedProducts);
                    setLoading(false)
                }
  
            })
            .catch(err => console.log(err))
    }, [update]);

    if (loading) return (<Loading />);
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
                    document.getElementById('msg-container').style.display = 'flex';
                }
            })
    };
    if (succMsg || errMsg) {
        document.addEventListener('click', e => {
            if (e.target.id === '' || e.target.id !== 'msg-container') {
                document.getElementById('msg-container').style.display = 'none';
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
                    <div className="msg-container" id="msg-container">
                        <header>
                            <p className="msg">{errMsg}</p>
                            <FontAwesomeIcon icon={faTimes} />
                        </header>
                        <div style={{ width: '50%', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                            <a href="/cart">Register</a>
                            <a href="/cart" style={{ marginLeft: '20px' }}>Login</a>
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
                            <a href="/cart" style={{ marginLeft: '20px' }}>Keep Shopping</a>
                        </div>
                    </div>
                    :
                    ''
                }
                <div style={{ height: '70%', }}>
                    <div>
                        <FontAwesomeIcon
                            icon={faArrowLeft}
                            className="left-arrow"
                            onClick={() => history.goBack()} />
                    </div>
                    <img
                        src={
                            imagePath
                                ?
                                `/images/${imagePath}`
                                :
                                `/images/${image}`}
                        alt={title}
                        loading="lazy"
                        style={{ width: '650px', height: '450px', borderRadius: '5px' }}
                    />

                    <div className="slider-container">
                        {
                            <Carousel responsive={responsive} pauseOnHover autoPlay={true} autoPlaySpeed={2000} infinite={true}>
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
                    <h1>{title}</h1>
                    <div style={{
                        border: '1px solid #2f384b',
                        borderRadius: '2px',
                        padding: '5px',
                        width: '70%',
                        height: '45%',
                        overflowY: 'scroll'
                    }}>
                        {ReactHtmlParser(desc)}
                    </div>
                    <div className="options-container" style={{ gridTemplateColumns: `repeat(${user?.isAdmin ? '4' : '3'} , 1fr)` }}>
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
                            isLogin &&
                            user?.isAdmin &&
                            <button
                                className="btn-prime"
                                style={{ background: '#f39c12' }}
                                aria-label="center"
                                onClick={() => history.push(`/edit/product/${path}`)}
                            >
                                Edit
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
                                    <div style={{ marginLeft: '20px', fontSize: 'large', }}>
                                        <span>{discountPrice}$</span>
                                        <br />
                                        <span className="price-element" style={{ fontSize: '15px', }}>Price {price}$</span>
                                        <span className="percentage-element">/ -{discountPercentage}%</span>
                                    </div>
                                    :
                                    <span style={{ marginLeft: '20px', fontSize: 'large', }}>Price {price}$</span>
                                :
                                ''
                        }
                        {
                            qty > 0 && discountScoreActive
                            &&
                            <div style={{ display: 'block' }}>
                                <label htmlFor="" className="points-options">
                                    <p>Buy With Points? cost ({discountScore.points})</p>
                                    <input type="checkbox" onChange={(e) => setCheckBuyWithPoints(e.target.checked)} />
                                </label>
                                <p>
                                    ({
                                        discount
                                            ?
                                            <span>New Price {Math.floor(discountPrice - (discountPrice * (discountScore.percentage / 100)))}$</span>

                                            :
                                            <span>New Price {Math.floor(price - (price * (discountScore.percentage / 100)))}$</span>
                                    })
                                    / -{discountScore.percentage}%
                                </p>
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
                                        style={{ color: rate <= (hover || rating) ? '#f1c40f' : '#95a5a6', fontSize: 'larger' }}
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

                <Carousel responsive={responsive} autoPlay={true} autoPlaySpeed={2000} infinite={true}>
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
