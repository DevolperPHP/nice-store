import React from 'react'
import AdminDashboard from './admin_dashboard'
import '../../style/admin/panel.css'
export default function Panel({userReducer}) {
    return (
        <section className="panel-section">
            <AdminDashboard/>
        </section>
    )
}
