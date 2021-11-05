import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faEdit, faStar, faTimes } from '@fortawesome/free-solid-svg-icons';
export default function CartProduct({ product, setUpdateProduct, updateProduct, setErrMsg, }) {
    const [changeQty, setChangeQty] = useState('');
    const handleUpdateQty = (e) => {
        let productId = '';
        if (e.target.tagName === 'svg') productId = e.target.parentElement.value;
        if (e.target.tagName === 'path') productId = e.target.parentElement.parentElement.value;
        if (e.target.tagName === 'BUTTON') productId =  e.target.value;
        
        const url = `${process.env.REACT_APP_SERVER_URL}/update/cart?type=updateQty`;
        axios.put(url, { qty: changeQty, productId }, { withCredentials: true })
            .then(res => {
                if (res.data.done) {
                    setUpdateProduct(!updateProduct)
                }
                else {
                    setErrMsg(res.data.errMsg)
                }
            });
    };
    const handleRemoveProduct = (e) => {
        const check = window.confirm('Sure You Want To remove it?');
        if (check) {
            let productId;
            let parent;
            if (e.target.tagName == 'svg') {
                productId = e.target.parentElement.value
                parent = e.target.parentElement.parentElement.parentElement
            };
            if (e.target.tagName == 'path') {
                productId = e.target.parentElement.parentElement.value
                parent = e.target.parentElement.parentElement.parentElement.parentElement
            };
            if (e.target.tagName == 'BUTTON') {
                productId = e.target.value;
                parent = e.target.parentElement.parentElement
            };
            parent.classList.add('active-remove')
            setTimeout(() => {
                parent.style.display = 'none';
                const url = `${process.env.REACT_APP_SERVER_URL}/update/cart?type=deleteProduct`;
                axios.put(url, { productId }, { withCredentials: true }).then(res => {
                    if (res.data.done) {
                        setUpdateProduct(!updateProduct)
                    }
                    else {
                        setErrMsg(res.data.errMsg)
                    }
                })
            }, 210);
        }

    }
    const { title, price, discountPrice, image, path, discount, _id, stars, userQty, discountPercentage, checkBuyWithPoints, qty, active } = product
    return (
        <div className="style-product" key={_id}>
            <div className="title">
                <a href={`/product/${path}`}>{title}</a>
            </div>

            <div>
                <img src={`/images/${image}`} alt={title} loading="lazy"/>
            </div>

            <div className="item-price-tag">
                {
                    discount
                        ?
                        <p>{discountPrice}$ (-{discountPercentage}%)</p>
                        :
                        <p>{price}$</p>
                }
            </div>

            <div className="item-stars">

                {[...Array(5)].map((star, index) => {
                    let totalStars = 0;
                    for (let i = 0; i < stars?.length; i++) {
                        totalStars += stars[i].value;
                    }
                    const rating = totalStars / stars?.length;
                    const rate = index + 1;

                    return (
                        <FontAwesomeIcon
                            key={rate}
                            icon={faStar}
                            style={{
                                color: rate <= rating ? '#f1c40f' : '#95a5a6',
                            }} />
                    )
                })}
                <span> {stars?.length}</span>
            </div>

            <div className="item-qty">
                <span>({userQty})</span>
            </div>
            {
                qty > 0
                &&
                active
                &&
                <label className="product-options">
                    <input type="number" min="1" onChange={(e) => setChangeQty(parseInt(e.target.value))} />
                    <button
                        value={_id}
                        onClick={handleUpdateQty}
                        style={{ marginLeft: '10px' }} className="cart-btn-prime"><FontAwesomeIcon icon={faEdit}/></button>
                </label>
            }
            {
                !active
                    ?
                    <div style={{ width: '15%', }}>
                        <span style={{ color: '#f39c12' }}>Product out of the Service</span>
                    </div>
                    :
                    qty < 1
                        ?
                        <div style={{ width: '13%', }}>
                            <span style={{ color: '#f39c12' }}>Product out of Stock</span>
                        </div>

                        :
                        checkBuyWithPoints && <span style={{ width: '7%',textAlign:'center' }}>Points <FontAwesomeIcon icon={faCheckSquare} style={{ color: '#1E90FF' }} /></span>
            }
            <label style={{ width: '2%', }}>
                <button
                    aria-label="right"
                    value={_id}
                    onClick={handleRemoveProduct}
                    className="cart-btn-prime"
                    style={{
                        width: '100%',
                        fontSize: 'large',
                        background: 'none',
                        color: 'tomato'
                    }}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </label>
        </div >
    )
}
