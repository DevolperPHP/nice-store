import React, { useState, useEffect } from 'react';
import Loading from '../main/loading';
import axios from 'axios';
import '../../style/account/orders.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faStar } from '@fortawesome/free-solid-svg-icons';

export default function Orders({userReducer}) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(async () => {
        const url = `${process.env.REACT_APP_SERVER_URL}/orders`;
        const res = await axios(url, { withCredentials: true });
        setOrders(res.data.orders);
        setLoading(false);
    }, []);
    if (loading || userReducer.loading) return (<Loading />);
    const user = userReducer.user;
    const isLogin = userReducer.isLogin
    if (userReducer.isLogin) {
        const firstName = user?.name.split(" ", 1).join("");
        var lastName = user?.name.split(" ")
        if (lastName.length > 1) {
            lastName.shift();
            lastName.join("")
        }
        else {
            lastName = ''
        }
        var finalName = firstName.split("");
        finalName = [...finalName, `'`, 's'].join("");
    }
    return (
        <section className="orders-section">
            {
                isLogin
                    ?
                    orders.length > 0
                        ?
                        <div className="max-orders">

                            <header>
                                <div>
                                    <h3>{`${finalName} ${lastName}`} Orders</h3>
                                    <a href="/products"><FontAwesomeIcon icon={faArrowLeft} /> Keep Ordering!</a>
                                </div>

                            </header>

                            <div className="flex-orders">
                                {
                                    orders.map(({ _id, items, totalPrice, date, totalPoints }) =>
                                        <div className="style-order">
                                            <header>
                                                <div>
                                                    <span>Order Id</span>
                                                    <p>{_id}</p>
                                                </div>

                                                <div>
                                                    <span>Date</span>
                                                    <p>{date}</p>
                                                </div>

                                                <div>
                                                    <span>Items</span>
                                                    <p>{items.length}</p>
                                                </div>

                                                <div>
                                                    <span>Total Price</span>
                                                    <p>{totalPrice}$</p>
                                                </div>

                                                <div>
                                                    <span>Total Points</span>
                                                    <p>{totalPoints}</p>
                                                </div>
                                            </header>
                                            <div className="order-items">
                                                {
                                                    items.map(({ title, price, userQty, path, image, stars, discount, _id, discountPrice, discountPercentage }) =>
                                                        <div className="style-item" key={_id}>
                                                            <div>
                                                                <a href={`/product/${path}`}>{title}</a>
                                                            </div>

                                                            <div>
                                                                <img src={`/images/${image}`} alt={title} />
                                                            </div>
                                                            <div style={{ width: '10%', height: '30px', display: 'flex', justifyContent: 'center', alignSelf: 'center' }}>
                                                                {
                                                                    discount
                                                                        ?
                                                                        <p>Price {discountPrice}$ (discount -{discountPercentage}%)</p>
                                                                        :
                                                                        <p>Price {price}$</p>
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
                                                                        <FontAwesomeIcon
                                                                            key={rate}
                                                                            icon={faStar}
                                                                            style={{
                                                                                color: rate <= rating ? '#f1c40f' : '#95a5a6',
                                                                                fontSize: 'large'
                                                                            }} />
                                                                    )
                                                                })}
                                                                <span> {stars?.length} {stars?.length <= 1 ? 'Review' : 'Reviews'}</span>
                                                            </div>

                                                            <div>
                                                                <span> Quantity ({userQty})</span>
                                                            </div>

                                                        </div >
                                                    )}
                                            </div>
                                        </div>
                                    )}
                            </div>


                        </div>
                        :
                        <div className="max-orders" style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <h3>Your Orders is Empty</h3>
                        </div>
                    :
                    <div className="max-orders" style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <h3>Please Login First</h3>
                    </div>
            }
        </section>
    )
}
