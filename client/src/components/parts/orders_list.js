import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import '../../style/parts/orders_list.css';
import { useParams } from 'react-router';
import axios from 'axios'
export default function OrdersList({ order, userReducer, setAdminFnsLoading }) {
    const { _id, items, totalPrice, date, totalPoints, finished, canceled, totalDiscount } = order;
    const { id } = useParams();
    const pathname = window.location.pathname;
    const resotreOrder = async () => {
        setAdminFnsLoading(true)
        const url = `${process.env.REACT_APP_SERVER_URL}/restore/order/${_id}`;
        await axios.put(url, {}, { withCredentials: true });
        setAdminFnsLoading(false)
    }
    const finshOrder = async () => {
        setAdminFnsLoading(true)
        const url = `${process.env.REACT_APP_SERVER_URL}/finsh/order/${_id}`;
        await axios.put(url, {}, { withCredentials: true });
        setAdminFnsLoading(false)
    }
    const cancelOrder = async () => {
        setAdminFnsLoading(true)
        const url = `${process.env.REACT_APP_SERVER_URL}/cancel/order/${_id}`;
        await axios.put(url, {}, { withCredentials: true });
        setAdminFnsLoading(false)
    }
    const deleteOrder = async () => {
        const check = window.confirm('Are you sure you want to delete this order?');
        if (check) {
            setAdminFnsLoading(true)
            const url = `${process.env.REACT_APP_SERVER_URL}/delete/order/${_id}`;
            await axios.delete(url, { withCredentials: true });
            setAdminFnsLoading(false)
        }
    }
    return (
        <div className="style-order" key={_id}>
            <header style={{ display: 'grid' }}>
                <div>
                    <span>Order Id</span>
                    <p>{_id}</p>
                </div>
                <br />
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
                    <span>Total Discount</span>
                    <p>{totalDiscount}$</p>
                </div>
                <div>
                    <span>Total Points</span>
                    <p>{totalPoints}</p>
                </div>
                {
                    !canceled
                        ?
                        <div>
                            <span style={{ color: '#3498DB' }}>Completed</span>
                            <p style={{ color: finished ? '#3498DB' : 'tomato', opacity: '1' }}>{finished.toString()}</p>
                        </div>
                        :
                        <div>
                            <span style={{ color: 'tomato' }}>Canceled</span>
                            <p style={{ color: 'tomato', opacity: '1' }}>{canceled.toString()}</p>
                        </div>
                }
                {
                    userReducer.user.isAdmin
                        &&
                        !id
                        ?
                        <a className="print-link" href={`/order/${_id}`} style={{ width: 'fit-content', height: 'fit-content' }}>Print Page</a>
                        :
                        <button onClick={(e) => window.print()}>Print</button>
                }
                <div>
                    {
                        userReducer.user.isAdmin
                        &&
                        <div>
                            <button
                                className="admin-btns"
                                style={{
                                    marginBottom: '10px',
                                    display: pathname === '/inqueue/orders' ? 'block' : 'none',
                                    marginLeft: '0px'
                                }}
                                onClick={finshOrder}>
                                Finsh
                            </button>

                            <button
                                className="admin-btns"
                                style={{
                                    background: '#f39c12',
                                    display: pathname === '/canceled/orders' ? 'block' : 'none',
                                    marginLeft: '0px'
                                }}
                                onClick={resotreOrder}>
                                Restore
                            </button>
                            <button
                                className="admin-btns"
                                style={{
                                    background: '#f39c12',
                                    marginLeft: '0px',
                                    display:
                                        pathname === '/canceled/orders'
                                            ?
                                            'none'
                                            :
                                            pathname === '/orders'
                                                ?
                                                'none'
                                                :
                                                !id && 'block'
                                }}
                                onClick={cancelOrder}>
                                Cancel
                            </button>

                            <button
                                className="admin-btns"
                                onClick={deleteOrder}
                                style={{
                                    marginTop: '10px',
                                    marginLeft: '0px',
                                    background: '#c0392b',
                                    display:
                                        pathname === '/orders'
                                            ?
                                            'none'
                                            :
                                            !id
                                                ?
                                                'block'
                                                :
                                                'none'
                                }}>
                                Delete
                            </button>

                        </div>

                    }
                </div>

            </header>
            <div className="order-items">
                {
                    items.map(({ title, price, userQty, path, image, stars, discount, _id, discountPrice, discountPercentage }) =>
                        <div className="style-item" key={_id}>
                            <div style={{ width: '15%' }}>
                                <a href={`/product/${path}`}>{title}</a>
                            </div>

                            <div>
                                <img src={`/images/${image}`} alt={title} loading="lazy"/>
                            </div>
                            <div style={{ width: '10%', height: '30px', display: 'flex', justifyContent: 'center', alignSelf: 'center' }}>
                                {
                                    discount
                                        ?
                                        <p>{discountPrice}$ (-{discountPercentage}%)</p>
                                        :
                                        <p>{price}$</p>
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
                                <span>({userQty})</span>
                            </div>

                        </div >
                    )}
            </div>
        </div>
    )
}
