import React, { useState, useEffect } from 'react';
import {ClearOutlined, DollarOutlined, HighlightOutlined, SaveOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getUserCart, emptyUserCart, saveUserAddress, applyCoupon,createCashOnOrderForUser } from '../functions/user.function';
import {cartConst, cashConst, couponConst} from '../actions/constants';
import {toast} from 'react-toastify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Checkout = ({ history }) => {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState('');
    const [addressSaved, setAddressSaved] = useState(false);
    const [coupon, setCoupon] = useState('');
    const [totalAfterDiscount, setTotalAfterDiscount] = useState('');
    const [discountError, setDiscountError] = useState('');

    const dispatch = useDispatch();
    const { user, COD } = useSelector((state) => ({...state}));
    const couponTrueOrFalse = useSelector((state) => state.coupon);

    useEffect(() => {
        getUserCart(user.token).then((res) => {
            console.log('User cart res--> ', JSON.stringify(res.data, null, 4));
            setProducts(res.data.products);
            setTotal(res.data.cartTotal);
        });
    },[user.token]);

    const emptyCart = () => {
        //remove cart from localStorage
        if (typeof window !== 'undefined'){
            localStorage.removeItem('cart');
        }
        //remove redux state
        dispatch({
            type: cartConst.ADD_TO_CART,
            payload: [],
        });
        //Remove from the Backend
        emptyUserCart(user.token).then((res) => {
            setProducts([]);
            setTotal(0);
            setTotalAfterDiscount(0);
            setCoupon('');
            toast.success('Cart is empty. Continue shopping.');
        });
    }


    const saveAddressToDB = () => {
        saveUserAddress(user.token, address).then((res) => {
            if(res.data.ok){
                setAddressSaved(true);
                toast.success('Address saved!');
            }
        });
    };

    const applyDiscountCoupon = () => {
        console.log('Send Coupon to backend', coupon);
        applyCoupon(user.token, coupon).then((res) => {
            console.log('RES ON COUPON APPLIED-->', res.data);
            if(res.data){
                setTotalAfterDiscount(res.data);
                dispatch({
                    type: couponConst.COUPON_APPLIED,
                    payload: true,
                });
            }
            //Error
            if(res.data.err){
                setDiscountError(res.data.err);
                //update redux coupon applied
                dispatch({
                    type:couponConst.COUPON_APPLIED,
                    payload: false,
                });
            }
        });
    };

    const showAddress = () => (
        <>
            <ReactQuill theme='snow' value={address} onChange={setAddress} />
            <br/>
            <Button
                onClick={saveAddressToDB}
                type='primary'
                block
                shape='round'
                className='mb-3'
                icon={<SaveOutlined />}>Save
            </Button>
        </>
    );
    const showProductSummary = () =>
        products.map((p, i) => (
            <div key={i}>
                <p>
                    {p.product.title} ({p.color}) x {p.count} ={' '}
                    {p.product.price * p.count}
                </p>
            </div>
        ));

    const showApplyCoupon = () => (
        <>
           <input
               onChange={(e) => {
                   setCoupon(e.target.value);
                   setDiscountError('');
               }}
               value={coupon}
               type='text'
               className='form-control'
           />
           <br/>
           <Button
               onClick={applyDiscountCoupon}
               type='primary'
               block
               shape='round'
               className='mb-3'
               icon={<HighlightOutlined />}>Apply
           </Button>
        </>
    );

    const createCashOnOrder = () => {
        createCashOnOrderForUser(user.token, COD, couponTrueOrFalse).then((res) => {
            console.log('USER CASH ORDER CREATED RES-->', res);

            if(res.data.ok){
                if(typeof window !== 'undefined') localStorage.removeItem('cart');
                //empty redux cart
                dispatch({
                    type: cartConst.ADD_TO_CART,
                    payload: [],
                });
                //empty redux coupon
                dispatch({
                    type: couponConst.COUPON_APPLIED,
                    payload: false,
                });
                //empty redux COD
                dispatch({
                    type: cashConst.COD,
                    payload: false,
                });
                //empty cart from Backend
                emptyUserCart(user.token);
                //redirect
                setTimeout(() => {
                    history.push('/user/history');
                }, 1000);
            }
        });
    };

    return (
        <div className='row'>
            <div className='col-md-6'>
                <h4>Delivery Address</h4>
                <br />
                <br />
                {showAddress()}
                <hr />
                <h4>Got A Coupon?</h4>
                <br />
                {showApplyCoupon()}
                <br/>
                {discountError && <p className='bg-danger p-2'>{discountError}</p>}
            </div>

            <div className='col-md-6'>
                <h4>Order Summary</h4>
                <hr />
                <p style={{fontWeight: '500'}}>Product(s): {products.length}</p>
                <hr />
                {showProductSummary()}
                <hr />
                <p style={{fontWeight: '500'}}>Cart Total: Ksh {total}</p>
                {totalAfterDiscount > 0 && (
                    <p className='bg-success p-2'>
                        Discount Applied: Total Payable: Ksh{totalAfterDiscount}
                    </p>
                )}

                <div className='row'>
                    <div className='col-md-6'>
                        {COD ? (
                            <Button
                                type='primary'
                                block
                                shape='round'
                                className='mb-3'
                                disabled={!addressSaved || !products.length}
                                onClick={createCashOnOrder}
                                icon={<DollarOutlined/>}>Place Order
                            </Button>
                        ) : (
                            <Button
                                type='primary'
                                block
                                shape='round'
                                className='mb-3'
                                disabled={!addressSaved || !products.length}
                                onClick={() => history.push('/payment')}
                                icon={<DollarOutlined/>}>Place Order
                            </Button>
                        )
                        }
                    </div>

                    <div className='col-md-6'>
                        <Button
                            onClick={emptyCart}
                            type='primary'
                            block
                            shape='round'
                            className='mb-3'
                            disabled={!products.length}
                            icon={<ClearOutlined />}>Clear Cart
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Checkout;
