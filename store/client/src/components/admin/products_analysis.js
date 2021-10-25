import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import AdminDashboard from './admin_dashboard';
import '../../style/admin/products_analysis.css'
export default function ProductsAnalysis() {
    const [productsSales, setProductsSales] = useState([]);
    const [productsSalesInMonths, setProductsSalesInMonths] = useState({});
    const [errMsg, setErrMsg] = useState('');
    useEffect(async () => {
        const res = await axios(
            `${process.env.REACT_APP_SERVER_URL}/graph/products/sales?date=1`,
            { withCredentials: true }
        );
        if (res.data.done) setProductsSales(res.data.products)
        const res2 = await axios(
            `${process.env.REACT_APP_SERVER_URL}/graph/products/sales/in/months?date=2`,
            { withCredentials: true }
        );
        if (res2.data.done) setProductsSalesInMonths(res2.data.data);
    }, []);
    const handleChangeDate = async (e) => {
        const value = e.target.value;
        const url = `${process.env.REACT_APP_SERVER_URL}/graph/products/sales?date=${value}`;
        const res = await axios(url, { withCredentials: true });
        if (res.data.done) setProductsSales(res.data.products)
        else setErrMsg(res.data.errMsg)
    };
    const salesInMonthChangeDate = async (e) => {
        const value = e.target.value;
        const url = `${process.env.REACT_APP_SERVER_URL}/graph/products/sales/in/months?date=${value}`;
        const res = await axios(url, { withCredentials: true });
        console.log(res.data);
        if (res.data.done) setProductsSalesInMonths(res.data.data)
        else setErrMsg(res.data.errMsg)
    }
    const productsSalesData = {
        labels: productsSales.map(product => product.title),
        datasets: [
            {
                label: 'Sale',
                data: productsSales.map(product => product.buyScore),
                borderWidth: 1,
                fill: true
            }
        ]
    };
    const productsSalesInMonthData = {
        labels: productsSalesInMonths.labels,
        datasets: [
            {
                label: 'Sale',
                data: productsSalesInMonths.data,
                borderWidth: 2,
                borderColor: '#f1f1f1',
                pointBackgroundColor: '#3498DB'
            }
        ]
    };
    return (
        <section className="products-analysis-section">
            <AdminDashboard />
            <div></div>
            <div className="max-analysis">
                <div className="analysis-section">
                    <h3>Products Sales</h3>
                    <select onChange={handleChangeDate}>
                        <option value="1">Last Month</option>
                        <option value="2">Last Two Months</option>
                        <option value="5">Last Five Months</option>
                        <option value="12">Last Twelve Months</option>
                        <option value="24">Last Two Years</option>
                    </select>
                    <div style={{ width: '60%', height: '10%' }}>

                        <Bar data={productsSalesData} options={{
                            responsive: true,
                            backgroundColor: '#f1f1f1',
                            color: '#f1f1f1',
                            plugins: {
                                filler: {
                                    propagate: true
                                },
                            }
                        }} />
                    </div>
                </div>
                <div className="analysis-section">
                    <h3>Sales in Months</h3>
                    <select onChange={salesInMonthChangeDate}>
                        <option value="2">Last Two Months</option>
                        <option value="5">Last Five Months</option>
                        <option value="12">Last Twelve Months</option>
                        <option value="24">Last Two Years</option>
                    </select>
                    <div style={{ width: '60%', height: '10%' }}>
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
