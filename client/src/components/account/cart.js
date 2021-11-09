import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../redux/actions/user';
import Loading from '../main/loading';
import '../../style/account/cart.css';
import CartProduct from '../parts/cart_product';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCartPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { LogarithmicScale } from 'chart.js';
export default function Cart({ userReducer }) {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [updateProduct, setUpdateProduct] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [succMsg, setSuccMsg] = useState("");
    useEffect(() => {
        const url = `${process.env.REACT_APP_SERVER_URL}/cart`;
        axios(url, { withCredentials: true }).then(({data}) => {
            setCart(data.items);
            setTotalPoints(data.totalPoints)
            setTotalPrice(data.totalPrice);
            setTotalDiscount(data.totalDiscount);
        })
        setLoading(false)
    }, [updateProduct]);

    const user = userReducer.user;
    const handleClear = () => {
        const check = window.confirm('Sure About Clear the Cart?');
        if (check) {
            const url = `${process.env.REACT_APP_SERVER_URL}/update/cart?type=clear`;
            axios.put(url, {}, { withCredentials: true })
                .then(res => {
                    setUpdateProduct(!updateProduct);
                    return (
                        <div className="cart-section">
                            <div className="max-cart">
                                <h2>Cart is Empty! <a href="/products">Keep Shopping</a></h2>
                            </div>
                        </div>
                    )
                }).catch(err => console.error(err))
        }
    };
    const handleCheckout = () => {
        const url = `${process.env.REACT_APP_SERVER_URL}/checkout`
        axios.post(url, {}, { withCredentials: true })
            .then(res => {
                if (res.data.done) {
                    setSuccMsg(res.data.succMsg);
                    return (
                        <div className="cart-section">
                            <div className="max-cart">
                                <h2>Order Completed Successfully! <a href="/orders">Vist Your orders</a></h2>
                            </div>
                        </div>
                    )
                }
                else setErrMsg(res.data.errMsg)
            })
    };
    if (loading) return (<Loading />)
    if (userReducer.isLogin) {
        var finalName = user?.name.split(" ");
        finalName = [...finalName, `'`, 's'].join("");
    }
    return (
        <section className="cart-section">
            {
                userReducer.isLogin
                    ?
                    cart?.length > 0
                        ?
                        <div className="max-cart">
                            <header>
                                <div>
                                    {
                                        errMsg &&
                                        <div className="cart-err-msg">
                                            <span style={{ color: 'tomato' }}>Note: </span>
                                            <span style={{ color: '#f39c12', marginLeft: '5px' }}> {errMsg}</span>
                                            <FontAwesomeIcon
                                                icon={faTimes}
                                                style={{ color: 'tomato', marginLeft: '5px', cursor: 'pointer' }}
                                                onClick={() => setErrMsg('')} />
                                        </div>
                                    }
                                    <h3>{finalName} Cart</h3>
                                    <a href="/products"><FontAwesomeIcon icon={faArrowLeft} /> Continue Shopping</a>

                                </div>

                                <div>
                                    <p>Total Price {totalPrice}$</p>
                                    <p>Total Discount {totalDiscount}$</p>
                                    <p>Total Points {totalPoints}</p>
                                </div>

                            </header>

                            <div className="flex-products">
                                {cart.map(product =>
                                    <CartProduct
                                        key={product._id}
                                        product={product}
                                        setUpdateProduct={setUpdateProduct}
                                        updateProduct={updateProduct}
                                        setErrMsg={setErrMsg}
                                        errMsg={errMsg} />
                                )}
                            </div>

                            <div className="cart-options">
                                <button
                                    style={{ background: 'tomato' }}
                                    onClick={handleClear}>
                                    Clear
                                </button>

                                <button
                                    style={{ marginLeft: '20px' }}
                                    onClick={handleCheckout}>
                                    Checkout
                                </button>
                            </div>
                        </div>
                        :
                        <div className="max-cart">
                            <h2>Cart is Empty! <a href="/products">Keep Shopping <FontAwesomeIcon icon={faCartPlus} /></a></h2>
                        </div>

                    :
                    <div className="max-cart">
                        <h2>Login and Keep Shopping <a href="/register">Register</a></h2>
                    </div>
            }
        </section>
    )
}
