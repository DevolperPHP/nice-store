import { faBookmark, faHome, faShippingFast, faShoppingCart, faUser, faShieldAlt, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, } from 'react'
import { useRef } from 'react';
import '../../style/main/header.css';
export default function Header({ userReducer }) {
    const linksRef = useRef(null);
    const beefBurgerRef = useRef(null);

    if (userReducer.loading) return (<div></div>);
    const { user, isLogin } = userReducer;
    const showNav = (e) => {
        linksRef.current.style.top = '55px';
        beefBurgerRef.current.classList.add('show-clip-path')
        beefBurgerRef.current.classList.remove('hide-clip-path')
        console.log(e.target);
        const open = document.getElementById('open');
        const close = document.getElementById('close');

        open.classList.remove('show');
        open.classList.add('hide');

        close.classList.add('show');
        close.classList.remove('hide');

        document.addEventListener('click', (e) => {

            if (e.target.id == 'beef-burger' || e.target.parentElement.id == 'beef-burger' || e.target.parentElement?.parentElement?.id == 'beef-burger') return
            else {
                beefBurgerRef.current.classList.add('hide-clip-path')
                beefBurgerRef.current.classList.remove('show-clip-path')

                document.getElementById('open').classList.add('show')
                document.getElementById('open').classList.remove('hide')

                document.getElementById('close').classList.remove('show')
                document.getElementById('close').classList.add('hide')
            }

        })
    }
    const hideNav = (e) => {
        beefBurgerRef.current.classList.add('hide-clip-path')
        beefBurgerRef.current.classList.remove('show-clip-path')
        console.log(e.target.tagName);
        const open = document.getElementById('open');
        const close = document.getElementById('close');

        open.classList.toggle('show')
        open.classList.toggle('hide')

        close.classList.toggle('show')
        close.classList.toggle('hide');
    };
    return (
        <section className="header-section">
            <div style={{
                width: '85%',
                height: 'inhert',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <ul><li style={{ listStyle: 'none', color: '#3498DB', fontSize: 'large', zIndex: '1750' }}>Logo</li></ul>
                <div className="links" ref={linksRef}>
                    <a href="/">Home <FontAwesomeIcon icon={faHome} /></a>
                    <a href="/products">Products <FontAwesomeIcon icon={faShippingFast} /></a>
                    {
                        isLogin
                            ?
                            <a href="/account">Account <FontAwesomeIcon icon={faUser} /></a>
                            :
                            <a href="/login">Login <FontAwesomeIcon icon={faUser} /></a>
                    }
                    <a href="/cart">Cart({isLogin ? user.cart.length : 0}) <FontAwesomeIcon icon={faShoppingCart} /></a>
                    <a href="/about">About <FontAwesomeIcon icon={faBookmark} /></a>
                    {isLogin && user.isAdmin ? <a href="/admin/panel">Admin Panle <FontAwesomeIcon icon={faShieldAlt} /></a> : ''}
                </div>

                <div className="beef-burger hide-clip-path" id="beef-burger" ref={beefBurgerRef}>
                    <header>
                        <div className="menu-container show" id="open" onClick={showNav} >
                            <FontAwesomeIcon icon={faBars} style={{ pointerEvents: 'none' }} />
                        </div>
                        <div className="menu-container hide" id="close" onClick={hideNav}>
                            <FontAwesomeIcon icon={faTimes} style={{ color: 'tomato', }} />
                        </div>
                    </header>

                    <div className="beef-burger-links" ref={linksRef} id="beef-burger-links">
                        <a href="/">Home <FontAwesomeIcon icon={faHome} /></a>
                        <a href="/products">Products <FontAwesomeIcon icon={faShippingFast} /></a>
                        {
                            isLogin
                                ?
                                <a href="/account">Account <FontAwesomeIcon icon={faUser} /></a>
                                :
                                <a href="/login">Login <FontAwesomeIcon icon={faUser} /></a>
                        }
                        <a href="/cart">Cart({isLogin ? user.cart.length : 0}) <FontAwesomeIcon icon={faShoppingCart} /></a>
                        <a href="/about">About <FontAwesomeIcon icon={faBookmark} /></a>
                        {isLogin && user.isAdmin ? <a href="/admin/panel">Admin Panle <FontAwesomeIcon icon={faShieldAlt} /></a> : ''}
                    </div>
                </div>
            </div>
        </section >
    )
}
