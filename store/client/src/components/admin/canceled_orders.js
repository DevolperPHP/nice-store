import React, { useEffect,useRef } from 'react'
import AdminDashboard from './admin_dashboard.js';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../.././redux/actions/orders';
import Loading from '../main/loading';
import OrdersList from '../parts/orders_list'
import '../../style/admin/admin_orders.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { showDashboard, hideDashboard } from './dashboard/main'
export default function CanceledOrders({ userReducer }) {
    const disptach = useDispatch();
    useEffect(() => {
        disptach(getOrders({ canceled: true }))
    }, []);
    const { orders, loading } = useSelector(state => state.ordersReducer);
    const dashBoardRef = useRef(null);
    if (loading) return (<Loading />);

    return (
        <section className="admin-orders-section">
            <AdminDashboard dashBoardRef={dashBoardRef}/>
            <div className="hide-item-without-purpose"></div>
            <div className="max-admin-orders">
                {
                    <div className="flex-admin-orders" style={{ alignItems: orders.length < 1 && 'center' }}>
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <h3>Finished Orders</h3>
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
                        </div>
                        {
                            orders.length > 0
                                ?

                                orders.map(order =>
                                    <OrdersList order={order} userReducer={userReducer} />
                                )

                                :
                                <h1>Empty Orders</h1>}
                    </div>
                }
            </div>
        </section>
    )
}
