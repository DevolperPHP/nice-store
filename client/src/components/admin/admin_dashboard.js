import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../style/admin/dashboard.css'
export default function AdminDashboard({ dashBoardRef }) {
    const { pathname } = useLocation();
    const [check, setCheck] = useState(false);
    useEffect(() => {
        setCheck(pathname === '/admin/panel' ? true : false);
    }, [])
    return (
        <aside ref={dashBoardRef} style={{
            width: check && '100%',
            opacity: check && '1',
            height: check && '100vh',
            pointerEvents: check && 'all',
            position:'static',
        }}>
            <a href="/add/product">Add Product</a>
            <a href="/add/category">Add Category</a>
            <a href="/inqueue/orders">In Queue Orders</a>
            <a href="/finished/orders">Finshed Orders</a>
            <a href="/canceled/orders">Cancled Orders</a>
            <a href="/deactiveted/products">Deactiveted Products</a>
            <a href="/products/analysis">Products Analysis</a>
            <a href="/users/analysis">Users Analysis</a>
        </aside>
    )
}
