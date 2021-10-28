import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Redirect } from "react-router-dom";
import OrdersList from '../parts/orders_list';
import Loading from '../main/loading';
import '../../style/admin/admin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
export default function Order({ userReducer }) {
    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    useEffect(async () => {
        const url = `${process.env.REACT_APP_SERVER_URL}/order/${id}`;
        const res = await axios(url, { withCredentials: true });
        console.log(res.data);
        if (res.data.done) setOrder(res.data.order);
        else (<Redirect to='/' />)
        setLoading(false)
    }, []);
    if (loading) return (<Loading />);
    return (
        <section className="order-section">
            <div style={{ width: '80%', alignSelf: 'center' }}>
                <FontAwesomeIcon
                    onClick={() => window.history.back()}
                    icon={faArrowLeft} />
                <OrdersList order={order} userReducer={userReducer} />
            </div>
        </section>
    )

}
