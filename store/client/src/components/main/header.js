import { faBookmark, faHome, faShippingFast, faShoppingCart, faUser,faShieldAlt,faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../redux/actions/user';
import '../../style/main/header.css';
export default function Header({userReducer}) {
    if (userReducer.loading) return (<div></div>);
    const user = userReducer.user;
    const isLogin = userReducer.isLogin
    return (
        <section className="header-section">
            <ul><li style={{listStyle:'none' , color:'#3498DB' , fontSize:'large'}}>Logo</li></ul>
            <div className="links">
                <a href="/">Home <FontAwesomeIcon icon={faHome}/></a>
                <a href="/products">Products <FontAwesomeIcon icon={faShippingFast}/></a>
                <a href="/account">Account <FontAwesomeIcon icon={faUser}/></a>
                <a href="/cart">Cart({isLogin ? user.cart.length : 0}) <FontAwesomeIcon icon={faShoppingCart}/></a>
                <a href="/about">About <FontAwesomeIcon icon={faBookmark}/></a>
                {isLogin && user.isAdmin ? <a href="/admin/panel">Admin Panle <FontAwesomeIcon icon={faShieldAlt}/></a> : ''}
            </div>
            <div style={{display:'none'}}>
                <FontAwesomeIcon icon={faBars}/>
            </div>
        </section>
    )
}
