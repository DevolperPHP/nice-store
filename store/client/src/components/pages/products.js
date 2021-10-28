import { faWpexplorer } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../../redux/actions/products';
import Loading from '../main/loading';
import '../../style/pages/products.css'
import ProductList from '../parts/product_list';
import { searchProducts } from '../../redux/actions/products';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
export default function Products() {
    const dispatch = useDispatch();
    const [sortPrice, setSortPrice] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        dispatch(getProducts(sortPrice))
    }, [sortPrice]);
    const reducer = useSelector(state => state.productsReducer);
    if (reducer.loading) return (<Loading />)
    const products = reducer.products;
    return (
        <section className="products-section">
            <div className="max-products">
                <header>
                    <h1>Exploar Products <FontAwesomeIcon icon={faWpexplorer} /></h1>
                    <select onChange={(e) => setSortPrice(e.target.value)}>
                        <option value="default">Default Price</option>
                        <option value="high">High to Low</option>
                        <option value="low">Low to High</option>
                        <option value="discount">Discount</option>
                    </select>
                    <div>
                        <input type="search" placeholder="Search" onChange={(e) => setSearchQuery(e.target.value)} />
                        <button onClick={() => dispatch(searchProducts(searchQuery, true))}><FontAwesomeIcon icon={faSearch} /></button>
                    </div>
                </header>
                {
                    products.length > 0
                        ?
                        <div className="style-products">
                            {products.map(product =>
                                <ProductList product={product} key={product._id} />
                            )}
                        </div>
                        :
                        <h3 style={{ color: "#f1f1f1", opacity: 0.8 }}>Products Will Arive Soon</h3>
                }
            </div>
        </section>
    )
}
