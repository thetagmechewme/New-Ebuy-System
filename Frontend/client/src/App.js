import './App.css';
// noinspection ES6CheckImport
import { Switch, Route } from 'react-router-dom';
import React, {useEffect, lazy, Suspense} from 'react';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {auth} from './firebase';
import {useDispatch} from 'react-redux';
import {userConst} from './actions/constants';
import {LoadingOutlined} from '@ant-design/icons';

/*import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import Home from './Components/Home';
import Header from './Layout/nav/Header';
import RegisterComplete from './Components/Auth/RegisterComplete';
import History from './Components/User/user.History';
import forgotPassword from './Components/Auth/forgotPassword';
import {currentUser} from './functions/auth.function';
import UserRoute from './Layout/routes/UserRoute';
import Password from './Components/User/Password';
import Wishlist from './Components/User/Wishlist';
import AdminDashboard from './Components/Admin/Admin.Dashboard';
import AdminRoute from './Layout/routes/AdminRoute';
import categoryCreate from './Components/Admin/Category/categoryCreate'
import CategoryUpdate from './Components/Admin/Category/CategoryUpdate';
import SubCategoryCreate from './Components/Admin/SubCategory/subCategoryCreate';
import SubCategoryUpdate from './Components/Admin/SubCategory/subCategoryUpdate';
import ProductCreate from './Components/Admin/Product/productCreate';
import AllProducts from './Components/Admin/Product/AllProducts';
import ProductUpdate from './Components/Admin/Product/productUpdate';
import Product from './Components/Product';
import CategoryHome from './Components/Category/CategoryHome';
import SubCategoryHome from './Components/Subcategory/SubCategoryHome';
import Shop from './Components/Shop';
import Cart from './Components/Cart';
import SideDrawer from './Layout/Drawer/SideDrawer';
import Checkout from './Components/Checkout';
import CreateCouponPage from './Components/Admin/Coupons/CreateCoupon';
import Payment from './Components/Payment';*/

const Login = lazy(() =>import('./Components/Auth/Login'));
const Register = lazy(() =>import('./Components/Auth/Register')) ;
const Home = lazy(() =>import('./Components/Home')) ;
const Header = lazy(() =>import('./Layout/nav/Header')) ;
const RegisterComplete = lazy(() =>import('./Components/Auth/RegisterComplete')) ;
const History = lazy(() =>import('./Components/User/user.History')) ;
const forgotPassword = lazy(() =>import('./Components/Auth/forgotPassword')) ;
const {currentUser} = lazy(() =>import('./functions/auth.function')) ;
const UserRoute = lazy(() =>import('./Layout/routes/UserRoute')) ;
const Password = lazy(() =>import('./Components/User/Password')) ;
const Wishlist = lazy(() =>import('./Components/User/Wishlist')) ;
const AdminDashboard = lazy(() =>import('./Components/Admin/Admin.Dashboard')) ;
const AdminRoute = lazy(() =>import('./Layout/routes/AdminRoute')) ;
const categoryCreate = lazy(() =>import('./Components/Admin/Category/categoryCreate'))
const CategoryUpdate = lazy(() =>import('./Components/Admin/Category/CategoryUpdate')) ;
const SubCategoryCreate = lazy(() =>import('./Components/Admin/SubCategory/subCategoryCreate')) ;
const SubCategoryUpdate = lazy(() =>import('./Components/Admin/SubCategory/subCategoryUpdate')) ;
const ProductCreate = lazy(() =>import('./Components/Admin/Product/productCreate')) ;
const AllProducts = lazy(() =>import('./Components/Admin/Product/AllProducts')) ;
const ProductUpdate = lazy(() =>import('./Components/Admin/Product/productUpdate')) ;
const Product = lazy(() =>import('./Components/Product')) ;
const CategoryHome = lazy(() =>import('./Components/Category/CategoryHome')) ;
const SubCategoryHome = lazy(() =>import('./Components/Subcategory/SubCategoryHome')) ;
const Shop = lazy(() =>import('./Components/Shop')) ;
const Cart = lazy(() =>import('./Components/Cart')) ;
const SideDrawer = lazy(() =>import('./Layout/Drawer/SideDrawer')) ;
const Checkout = lazy(() =>import('./Components/Checkout')) ;
const CreateCouponPage = lazy(() =>import('./Components/Admin/Coupons/CreateCoupon')) ;
const Payment = lazy(() =>import('./Components/Payment')) ;

const App = () => {
    const dispatch = useDispatch();

    //Checking Firebase auth state
    useEffect(() => {
        const cleanup = auth.onAuthStateChanged( async (user) => {
            if(user){
                const idTokenResult = await user.getIdTokenResult()
                console.log('User: ', user);

                currentUser(idTokenResult.token)
                    .then((res => {
                        dispatch({
                            type: userConst.LOGGED_IN_USER,
                            payload: {
                                name: res.data.name,
                                email: res.data.email,
                                token: idTokenResult.token,
                                role: res.data.role,
                                _id: res.data._id,
                            },
                        });
                    }))
                    .catch(err => console.log(err));
            }
        });
        //Cleanup
        return () => cleanup();
    },[dispatch]);

    return(
        <Suspense
            fallback={
                <div className="col text-center p-5">
                    <LoadingOutlined />
                    __SE-EBUY-SYSTEM__
                </div>
            }
        >
            <Header />
            <SideDrawer />
            <ToastContainer />
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/login' component={Login}/>
                <Route exact path='/register' component={Register} />
                <Route exact path='/product/:slug' component={Product} />
                <Route exact path='/register/user_verify' component={RegisterComplete}/>
                <Route  exact path='/forgot_password' component={forgotPassword} />
                <Route exact path='/category/:slug' component={CategoryHome} />
                <Route exact path='/subcategory/:slug' component={SubCategoryHome} />
                <Route exact path='/shop' component={Shop} />
                <Route exact path='/cart' component={Cart} />
                <UserRoute exact path='/user/history' component={History} />
                <UserRoute exact path='/user/password' component={Password} />
                <UserRoute exact path='/user/wishlist' component={Wishlist} />
                <UserRoute exact path='/checkout' component={Checkout} />
                <UserRoute exact path='/payment' component={Payment} />
                <AdminRoute exact path='/admin/dashboard' component={AdminDashboard} />
                <AdminRoute exact path='/admin/category' component={categoryCreate} />
                <AdminRoute exact path='/admin/category/:slug' component={CategoryUpdate} />
                <AdminRoute exact path='/admin/subcategory' component={SubCategoryCreate} />
                <AdminRoute exact path='/admin/subcategory/:slug' component={SubCategoryUpdate} />
                <AdminRoute exact path='/admin/product' component={ProductCreate} />
                <AdminRoute exact path='/admin/products' component={AllProducts} />
                <AdminRoute exact path='/admin/product/:slug' component={ProductUpdate} />
                <AdminRoute exact path='/admin/coupon' component={CreateCouponPage} />
            </Switch>
        </Suspense>

    );
};

export default App;
