import React from 'react'
import '../../style/admin/dashboard.css'
export default function AdminDashboard() {
    return (
        <aside>
            <a href="/inqueue/orders">In Queue Orders</a>
            <a href="/finshed/orders">Finshed Orders</a>
            <a href="/cancled/orders">Cancled Orders</a>
            <a href="/deactiveted/products">Deactiveted Products</a>
            <a href="/products/analysis">Products Analysis</a>
            <a href="/users/analysis">Users Analysis</a>
        </aside>
    )
}
