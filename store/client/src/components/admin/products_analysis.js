import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import AdminDashboard from './admin_dashboard';
import '../../style/admin/analysis.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { showDashboard, hideDashboard } from './dashboard/main';
import Loading from '../main/loading';

export default function ProductsAnalysis() {
    const [productsSales, setProductsSales] = useState([]);
    const [productsSalesInMonths, setProductsSalesInMonths] = useState({});
    const [errMsg, setErrMsg] = useState('');
    const dashBoardRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(async () => {
        const res = await axios(
            `${process.env.REACT_APP_SERVER_URL}/graph/products/sales?date=1`,
            { withCredentials: true }
        );

        if (res.data.done) setProductsSales(res.data.data);
        const res2 = await axios(
            `${process.env.REACT_APP_SERVER_URL}/graph/products/sales/in/months?date=2`,
            { withCredentials: true }
        );
        if (res2.data.done) setProductsSalesInMonths(res2.data.data);
        setLoading(false)
    }, []);
    const handleChangeDate = async (e) => {
        const value = e.target.value;
        const url = `${process.env.REACT_APP_SERVER_URL}/graph/products/sales?date=${value}`;
        const res = await axios(url, { withCredentials: true });
        if (res.data.done) setProductsSales(res.data.data)
        else setErrMsg(res.data.errMsg);
    };
    const salesInMonthChangeDate = async (e) => {
        const value = e.target.value;
        const url = `${process.env.REACT_APP_SERVER_URL}/graph/products/sales/in/months?date=${value}`;
        const res = await axios(url, { withCredentials: true });

        if (res.data.done) setProductsSalesInMonths(res.data.data)
        else setErrMsg(res.data.errMsg);
    };
    if (loading) return (<Loading />)
    const productsSalesData = {
        labels: productsSales.products?.map(product => product.title),
        datasets: [
            {
                label: 'Sale',
                data: productsSales.products?.map(product => product.buyScore),
                borderWidth: 1,
                fill: true
            }
        ]
    };
    const productsSalesInMonthData = {
        labels: productsSalesInMonths?.labels,
        datasets: [
            {
                label: 'Sale',
                data: productsSalesInMonths?.data,
                borderWidth: 2,
                borderColor: '#3498DB',
                pointBackgroundColor: '#f4f4f4'
            }
        ]
    };
    return (
        <section className="main-analysis-section">
            <AdminDashboard dashBoardRef={dashBoardRef} />
            <div className="hide-item-without-purpose"></div>
            <div className="max-analysis">
                <div className="analysis-section">
                    <header>
                        <h3>Individual Product Sales ({productsSales.totalSales})</h3>
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
                    <select onChange={handleChangeDate}>
                        <option value="1">Last Month</option>
                        <option value="2">Last Two Months</option>
                        <option value="5">Last Five Months</option>
                        <option value="12">Last Twelve Months</option>
                        <option value="24">Last Two Years</option>
                    </select>
                    <div className="graph-container">

                        <Bar data={productsSalesData} options={{
                            responsive: true,
                            backgroundColor: '#3498DB',
                            color: '#f1f1f1',
                            plugins: {
                                filler: {
                                    propagate: true
                                },
                            },
                        }} />
                    </div>
                </div>
                <div className="analysis-section">
                    <h3>Individual Month Sales ({productsSalesInMonths.totalSales})</h3>
                    <select onChange={salesInMonthChangeDate}>
                        <option value="2">Last Two Months</option>
                        <option value="5">Last Five Months</option>
                        <option value="12">Last Twelve Months</option>
                        <option value="24">Last Two Years</option>
                    </select>
                    <div className="graph-container">
                        <Line data={productsSalesInMonthData} options={{
                            radius: 4,
                            hitRadius: 20,
                            tension: .4,
                            responsive: true,
                            plugins: {
                                filler: {
                                    propagate: true,
                                }
                            }
                        }} />
                    </div>

                </div>
            </div>
        </section>
    )
}
