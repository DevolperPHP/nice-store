import React, {useEffect , useState} from 'react';
import { useSelector , useDispatch } from 'react-redux';
import { getProducts } from '../../redux/actions/products';
import Loading from '../main/loading';
import '../../style/pages/home.css';
import '../../style/parts/home.css';
import Category from '../parts/category';

//PACKAGES
import Discount from '../parts/discount';
import Recently from '../parts/recently'
import Slider from '../parts/slider';
import Ranking from '../parts/ranking';

export default function Home({userReducer}) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getProducts('default', true));
    }, []);
    const productsReducer = useSelector(state => state.productsReducer);
    if (productsReducer.loading) return (<Loading/>);
    const products = productsReducer.products;
 
    return (
        <section className="home-container">
            <div className="max-home" >
                <Slider />
                <Recently products={products}/>
                <Discount products={products}/>
                <Ranking/>
                <Category userReducer={userReducer}/>
            </div>
        </section>
    )
}