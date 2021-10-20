import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch, useHistory, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from './redux/actions/user';
import './style/main/app.css'
//COMPONENTS
import Products from './components/pages/products';
import Home from './components/pages/home';
import Login from './components/account/login';
import Register from './components/account/register';
import Header from './components/main/header';
import Account from './components/account/account';
import AddProduct from './components/admin/add_product';
import EditProduct from './components/admin/edit_product';
import Product from './components/pages/product';
import AddCategory from './components/admin/add_category';
import Cart from './components/account/cart';
import Orders from './components/account/orders'
import VerifyAccount from './components/account/verify_account';
import DeleteAccount from './components/account/delete_account';
import Loading from './components/main/loading';
import Panel from './components/admin/panel';
import ProductsAnalysis from './components/admin/products_analysis'
function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUser());
    }, []);
    const userReducer = useSelector(state => state.userReducer);

    if (userReducer.loading) return (< Loading />)
    const isLogin = userReducer.isLogin;
    const user = userReducer.user;
    return (
        <div className="App">
            <Router>
                <Header userReducer={userReducer} />
                <Route exact path="/" component={Home} />
                <Route exact path="/products" component={Products} />
                <Route exact path="/admin/panel">
                    {isLogin && user.isAdmin ? <Panel userReducer={userReducer}/> : <Redirect to="/"/>}
                </Route>
                <Route exact path="/login">
                    {isLogin ? <Redirect to="/account" /> : <Login />}
                </Route>

                <Route exact path="/register">
                    {isLogin ? <Redirect to="/account" /> : <Register />}
                </Route>

                <Route exact path="/account" userReducer={userReducer}>
                    {isLogin ? <Account userReducer={userReducer} /> : <Redirect to="/login" />}
                </Route>

                <Route exact path="/cart" component={Cart}>
                    <Cart userReducer={userReducer} />
                </Route>

                <Route exact path="/add/product">
                    {!isLogin || !user.isAdmin ? <Redirect to="/" /> : <AddProduct />}
                </Route>

                <Route exact path="/product/:path">
                    <Product userReducer={userReducer} />
                </Route>

                <Route exact path="/edit/product/:path">
                    {!isLogin || !user.isAdmin ? <Redirect to="/" /> : <EditProduct />}
                </Route>

                <Route exact path="/products/analysis/">
                    {!isLogin || !user.isAdmin ? <Redirect to="/" /> : <ProductsAnalysis />}
                </Route>

                <Route exact path="/add/category">
                    {!isLogin || !user.isAdmin ? <Redirect to="/" /> : <AddCategory />}
                </Route>

                <Route exact path="/orders" component={Orders}>
                    <Orders userReducer={userReducer} />
                </Route>

                <Route exact path="/verify/account/:token">
                    {!isLogin ? <VerifyAccount /> : <Redirect to="/" />}
                </Route>

                <Route exact path="/delete/account/:token">
                    {isLogin ? <DeleteAccount /> : <Redirect to="/" />}
                </Route>

            </Router>
        </div>
    );
}

export default App;