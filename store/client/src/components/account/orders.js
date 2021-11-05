import React, { useState, useEffect } from 'react';
import Loading from '../main/loading';
import axios from 'axios';
import '../../style/account/orders.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, } from '@fortawesome/free-solid-svg-icons';
import OrdersList from '../parts/orders_list';
export default function Orders({ userReducer }) {
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
                                    orders.map((order, index) =>
                                        <OrdersList
                                            key={index}
                                            order={order}
                                            userReducer={userReducer}/>
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
