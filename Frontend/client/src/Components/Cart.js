import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {BookOutlined, CarOutlined, ClockCircleOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import ProductCardInCheckout from '../Layout/Cards/ProductCardInCheckout';
import { userCart } from '../functions/user.function';
import {cashConst} from '../actions/constants';

const Cart = ({ history }) => {
    const { user, cart } = useSelector((state) => ({...state}));
    const dispatch = useDispatch();

    const getTotal = () => {
        return cart.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0);
    };
    const saveOrderToDB = () => {
        /*alert('Save order to DB');
        history.push('/checkout');*/
        userCart(cart, user.token)
            .then((res) => {
                console.log('CART POST RES: ', res);
                if(res.data.ok) history.push('/checkout');
            })
            .catch((err) => console.log('Cart save err: ', err));
    };
    const saveCashOrderToDb = () => {
        dispatch({
            type: cashConst.COD,
            payload: true,
        });
        userCart(cart, user.token)
            .then((res) => {
                console.log("CART POST RES-->", res);
                if(res.data.ok) history.push('/checkout');
            })
            .catch((err) => console.log('Cart save err-->', err));
    };

    const showCartItems = () => (
        <table className='table table-bordered'>
            <thead className='thead-light'>
            <tr>
                <th scope='col'>Image</th>
                <th scope='col'>Title</th>
                <th scope='col'>Price</th>
                <th scope='col'>Brand</th>
                <th scope='col'>Color</th>
                <th scope='col'>Quantity</th>
                <th scope='col'>Shipping</th>
                <th scope='col'>Remove</th>
            </tr>
            </thead>

            {cart.map((p) => (
                <ProductCardInCheckout key={p._id} p={p} />
            ))}
        </table>
    );


    return (
        <div className='container-fluid pt-2'>
            <div className='row'>
                <div className='col-md-8'>
                    <h4>Cart Item(s): {cart.length} Product(s)</h4>

                    {!cart.length ? (
                        <p>
                            No products in cart. <Link to='/shop'>Continue Shopping.</Link>
                        </p>
                    ) : (
                        showCartItems()
                    )}
                </div>
                <div className='col-md-4'>
                    <h4>Order Summary</h4>
                    <hr />
                    <p>Products</p>
                    {cart.map((c, i) => (
                        <div key={i}>
                            <p>
                                {c.title} x {c.count} = Ksh {c.price * c.count}
                            </p>
                        </div>
                    ))}
                    <hr />
                    Total: <b>Ksh {getTotal()}</b>
                    <hr />
                    {user ? (
                    <>
                        <Button
                            onClick={saveOrderToDB}
                            type='primary'
                            block
                            shape='round'
                            className='mb-3'
                            disabled={!cart.length}
                            icon={<BookOutlined />}>Proceed to Checkout
                        </Button>
                        <br/>
                        <Button
                            onClick={saveCashOrderToDb}
                            type='primary'
                            block
                            shape='round'
                            className='mb-3'
                            disabled={!cart.length}
                            icon={<CarOutlined />}>Pay Cash On Delivery
                        </Button>
                    </>
                    ) : (
                        <Button
                            type='primary'
                            block
                            shape='round'
                            className='mb-3'
                            size='large'
                            icon={<ClockCircleOutlined />}>
                            <Link
                                style={{color: '#fff'}}
                                to={{
                                    pathname: '/login',
                                    state: { from: 'cart' },
                                }}
                            > Login to Checkout
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Cart;
