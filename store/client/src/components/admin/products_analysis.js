import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2'
export default function ProductsAnalysis() {
    const [products, setProducts] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    useEffect(async () => {
        const url = `${process.env.REACT_APP_SERVER_URL}/graph/products?date=lastMonth`;
        const res = await axios(url, { withCredentials: true });
        if (res.data.done) setProducts(res.data.products)
        else setErrMsg(res.data.errMsg)
    }, []);
    const handleChangeDate = async (e) => {
        const value = e.target.value;
        const url = `${process.env.REACT_APP_SERVER_URL}/graph/products?date=${value}`;
        const res = await axios(url, { withCredentials: true });
        if (res.data.done) setProducts(res.data.products)
        else setErrMsg(res.data.errMsg)
    }
    const data = {
        labels: products.map(product => product.title),
        datasets: [
            {
                label: 'Products Sales',
                data: products.map(product => product.buyScore),
                borderWidth: 1,

            }
        ]
    }
    return (
        <section className="graph-products-section">
            {errMsg}
            <select onChange={handleChangeDate}>
                <option value="lastMonth">Last Month</option>
                <option value="lastFiveMonths">Last Five Months</option>
                <option value="LastTweleveMonths">Last 12 Months</option>
            </select>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${products.length}, 1fr)`, width: '30%', height: '10%', alignItems: 'flex-end' }}>

                <Bar data={data} options={{
                    responsive: true, backgroundColor: 'red', plugins: {
                        filler: {
                            propagate: true
                        },
                    }
                }} />
            </div>
        </section>
    )
}
