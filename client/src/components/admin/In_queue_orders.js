import React, { useEffect, useRef, useState } from 'react'
import AdminDashboard from './admin_dashboard.js';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders, searchOrders } from '../.././redux/actions/orders';
import Loading from '../main/loading';
import OrdersList from '../parts/orders_list';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../style/admin/admin.css';
import { showDashboard, hideDashboard } from './dashboard/main'
export default function InQueueOrders({ userReducer }) {
    const dispatch = useDispatch();
    const [adminFnsLoading, setAdminFnsLoading] = useState(false);
    useEffect(() => {
        dispatch(getOrders({ finished: false, canceled: false }))
    }, []);
    const dashBoardRef = useRef(null);
    const inputSeachRef = useRef(null);
    const { orders, loading } = useSelector(state => state.ordersReducer);
    if (loading || adminFnsLoading) return (<Loading />);

    return (
        <section className="admin-main-section">
            <AdminDashboard dashBoardRef={dashBoardRef} />
            <div className="hide-item-without-purpose"></div>
            <div className="max-admin-main">
                {
                    <div className="flex-admin-main">
                        <header style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <h3>In Queue Orders</h3>
                                <input type="text" name='_id' ref={inputSeachRef} />
                                <button className="search-btn" onClick={() => dispatch(searchOrders(inputSeachRef.current.value, { finished: false, canceled: false }))}>Search</button>
                            </div>
                            <FontAwesomeIcon
                                icon={faBars}
                                className="show-dashboard-menu"
                                id="open-menu"
                                onClick={() => showDashboard(dashBoardRef)} />
                            <FontAwesomeIcon
                                icon={faTimes}
                                className="hide-dashboard-menu"
                                id="close-menu"
                                style={{ color: 'tomato' }}
                                onClick={() => hideDashboard(dashBoardRef)} />
                        </header>
                        {
                            orders.length > 0
                                ?
                                orders.map(order =>
                                    <OrdersList order={order} userReducer={userReducer} setAdminFnsLoading={setAdminFnsLoading} />
                                )
                                :
                                <h1 style={{ marginTop: '20px', opacity: '.6' }}>Empty</h1>
                        }
                    </div>
                }
            </div>
        </section>
    )
}
