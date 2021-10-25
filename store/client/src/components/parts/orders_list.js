import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import '../../style/parts/orders_list.css';
import { useParams } from 'react-router';

export default function OrdersList({ order, userReducer, match }) {
    const { _id, items, totalPrice, date, totalPoints, finished, canceled } = order;
    const { id } = useParams()
    return (
        <div className="style-order" key={_id}>
            <header style={{ display: 'grid' }}>
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
            </header>
            <div className="order-items">
                {
                    items.map(({ title, price, userQty, path, image, stars, discount, _id, discountPrice, discountPercentage }) =>
                        <div className="style-item" key={_id}>
                            <div style={{ width:'15%'}}>
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
    )
}
