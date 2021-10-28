import React, { useEffect, useState, useRef } from 'react'
import { showDashboard, hideDashboard } from './dashboard/main';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Loading from '../main/loading';
import '../../style/admin/admin.css';
import AdminDashboard from './admin_dashboard';
import { getProducts, searchProducts } from '../../redux/actions/products'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
export default function DeactivetedProducts() {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getProducts('default', false));
    }, [])
    const dashBoardRef = useRef(null);
    const inputSeachRef = useRef(null);
    const [succMsg, setSuccMsg] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const { loading, products, } = useSelector(state => state.productsReducer);
    if (loading) return (<Loading />);
    const activeProduct = async (e) => {
        const id = e.target.value;
        const url = `${process.env.REACT_APP_SERVER_URL}/active/product/${id}`;
        const { data } = await axios.put(url, {}, { withCredentials: true });
        if (data.done) {
            setSuccMsg(data.msg);
            setErrMsg('');
        }
        else {
            setErrMsg(data.errMsg);
            setSuccMsg('');
        };
    }
    return (
        <section className="admin-orders-section">
            <AdminDashboard dashBoardRef={dashBoardRef} />
            <div className="hide-item-without-purpose"></div>
            <div className="max-admin-orders">
                {
                    <div className="flex-admin-orders" style={{ alignItems: products.length < 1 && 'center' }}>
                        <header style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            {succMsg && <p>{succMsg}</p>}
                            {errMsg && <p>{errMsg}</p>}
                            <div>
                                <h3>Deactiveted Products</h3>
                                <input type="text" name='title' ref={inputSeachRef} />
                                <button onClick={() => dispatch(searchProducts(inputSeachRef.current.value, false))}>Search</button>
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
                            products.length > 0
                                ?
                                products.map(({ image, title, active, _id }) =>
                                    <div className="style-deactiveted-product" key={_id}>
                                        <div>
                                            <span>{title}</span>
                                        </div>
                                        <div>
                                            <img src={`/images/${image}`} alt={title} />
                                        </div>
                                        <div>
                                            <p>active <span style={{ color: 'tomato' }}>{active.toString()}</span></p>
                                        </div>
                                        <div>
                                            <button value={_id} onClick={activeProduct}>Active</button>
                                        </div>
                                    </div>
                                )
                                :
                                <h1>Empty</h1>
                        }
                    </div>
                }
            </div>
        </section>
    )
}
