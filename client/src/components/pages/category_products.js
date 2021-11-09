import { faWpexplorer } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import Loading from '../main/loading';
import '../../style/pages/products.css'
import ProductList from '../parts/product_list';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
export default function Products({ match }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(async () => {
        const url = `${process.env.REACT_APP_SERVER_URL}/category/${match.params.path}?sort=default`;
        const { data } = await axios(url);
        setProducts(data);
        setLoading(false);
    }, []);
    if (loading) return (<Loading />);
    const search = async (e) => {
        const url = `${process.env.REACT_APP_SERVER_URL}/search/category/${match.params.path}?title=${searchQuery}`;
        const { data } = await axios(url);
        setProducts(data);
    };
    const changeSort = async (e) => {
        const url = `${process.env.REACT_APP_SERVER_URL}/category/${match.params.path}?sort=${e.target.value}`;
        const { data } = await axios(url);
        setProducts(data);
    }
    return (
        <section className="products-section">
            <div className="max-products">
                <header>
                    <h1>Explore Products <FontAwesomeIcon icon={faWpexplorer} /></h1>
                    <select onChange={changeSort}>
                        <option value="default">Default Price</option>
                        <option value="high">High to Low</option>
                        <option value="low">Low to High</option>
                        <option value="discount">Discount</option>
                    </select>
                    <div>
                        <input type="search" placeholder="Search" onChange={(e) => setSearchQuery(e.target.value)} />
                        <button onClick={search}>
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
                                )}
                        </div>
                        :
                        <h3 style={{ color: "#f1f1f1", opacity: '0.8' }}>Products Will Arive Soon</h3>
                }
            </div>
        </section>
    )
}
