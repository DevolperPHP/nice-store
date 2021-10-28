import React from 'react'
import '../../style/admin/dashboard.css'
export default function AdminDashboard({dashBoardRef}) {
    return (
        <aside ref={dashBoardRef}>
            <a href="/inqueue/orders">In Queue Orders</a>
            <a href="/finished/orders">Finshed Orders</a>
            <a href="/canceled/orders">Cancled Orders</a>
            <a href="/deactiveted/products">Deactiveted Products</a>
            <a href="/products/analysis">Products Analysis</a>
            <a href="/users/analysis">Users Analysis</a>
        </aside>
    )
}
