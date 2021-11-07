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
import axios from 'axios';
import { getCategories } from '../../redux/actions/categories';
export default function Products() {
    const dispatch = useDispatch();
    const [sortPrice, setSortPrice] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(async () => {
        const url = `${process.env.REACT_APP_SERVER_URL}/products?sort${sortPrice}&&active=true`;
        const { data } = await axios(url);
        setProducts(data)
        setLoading(false);
        dispatch(getCategories());
    }, []);

    const reducer = useSelector(state => state.categoriesReducer);
    if (reducer.loading || loading) return (<Loading />)
    const changeCategory = async (e) => {
        const category = e.target.value;
        const url = `${process.env.REACT_APP_SERVER_URL}/category/${category}?sort=${sortPrice}`;
        const { data } = await axios(url);
        setProducts(data);
    }
    const changePriceSort = async (e) => {
        const url = `${process.env.REACT_APP_SERVER_URL}/products?sort=${e.target.value}&&active=true`;
        const { data } = await axios(url);
        setSortPrice(e.target.value)
        setProducts(data);
    }
    return (
        <section className="products-section">
            <div className="max-products">
                <header>
                    <h1>Explore Products <FontAwesomeIcon icon={faWpexplorer} /></h1>
                    <div style={{ display: 'flex'}}>
                        <select onChange={changePriceSort}>
                            <option value="default">Default</option>
                            <option value="high">High to Low</option>
                            <option value="low">Low to High</option>
                            <option value="discount">Discount</option>
                        </select>
                        <select onChange={changeCategory} style={{ marginLeft: '10px' }}>
                            <option>Category</option>
                            {
                                reducer.categories.map(({ title, _id, path }) =>
                                    <option key={_id} value={path}>{title}</option>
                                )
                            }
                        </select>
                    </div>

                    <div>
                        <input type="search" placeholder="Search" onChange={(e) => setSearchQuery(e.target.value)} />
                        <button onClick={() => {
                            dispatch(searchProducts(searchQuery, true))
                            setSearchQuery('')
                        }}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </header>
                {
                    products.length > 0
                        ?
                        <div className="style-products">
                            {
                                products?.map(product =>
                                    <ProductList product={product} key={product._id} />
                                )
                            }
                        </div>
                        :
                        <h3 style={{ color: "#f1f1f1", opacity: 0.8 }}>Products Will Arive Soon</h3>
                }
            </div>
        </section>
    )
}
