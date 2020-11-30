import React from 'react';
import ModalImage from 'react-modal-image';
import ps5 from '../../images/ps5.jpg';
import { useDispatch } from 'react-redux';
import {cartConst} from '../../actions/constants';
import {toast} from "react-toastify";
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';

const ProductCardInCheckout = ({ p }) => {
    const colors = ['Black', 'Brown', 'Silver', 'White', 'Blue',];
    let dispatch = useDispatch();

    const handleColorChange = (e) => {
        console.log('Color changed: ', e.target.value);

        let cart = [];
        if (typeof window !== 'undefined'){
            if(localStorage.getItem('cart')){
                cart = JSON.parse(localStorage.getItem('cart'));
            }

            cart.map((product, i) =>{
                if(product._id === p._id){
                    cart[i].color = e.target.value;
                }
            });

            localStorage.setItem('cart', JSON.stringify(cart));
            dispatch({
                type: cartConst.ADD_TO_CART,
                payload: cart,
            });
        }
    };

    const handleQuantityChange = (e) => {
        let count = e.target.value < 1 ? 1 : e.target.value;

        if (count > p.quantity) {
            toast.error(`Maximum available quantity: ${p.quantity}`);
            return;
        }

        let cart = [];
        if(typeof window  !== 'undefined'){
            if(localStorage.getItem('cart')){
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            cart.map((product, i) => {
                if(product._id === p._id){
                    cart[i].count = count;
                }
            });

            localStorage.setItem('cart', JSON.stringify(cart));
            dispatch({
                type: cartConst.ADD_TO_CART,
                payload: cart,
            });
        }
    };

    const handleRemove = () => {
        let cart = [];
        if(typeof window !== 'undefined'){
            if(localStorage.getItem('cart')){
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            cart.map((product, i) => {
                if(product._id === p._id){
                    cart.splice(i, 1);
                }
            });
            localStorage.setItem('cart', JSON.stringify(cart));
            dispatch({
                type: cartConst.ADD_TO_CART,
                payload: cart,
            });
        }
    };


    return (
        <tbody>
            <tr>
                <td>
                    <div style={{ width: '70px', height: 'auto' }}>
                        {p.images.length ? (
                            <ModalImage small={p.images[0].url} large={p.images[0].url} />
                        ) : (
                            <ModalImage small={ps5} large={ps5} />
                        )}
                    </div>
                </td>
                <td>{p.title}</td>
                <td>Ksh {p.price}</td>
                <td>{p.brand}</td>
                <td>
                    <select
                        onChange={handleColorChange}
                        name='color'
                        className='form-control'
                    >
                        {p.color ? (
                            <option value={p.color}>{p.color}</option>
                        ) : (
                            <option>Select</option>
                        )}
                        {colors
                            .filter((c) => c !== p.color)
                            .map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                    </select>
                </td>
                <td className='text-center'>
                    <input
                        style={{width: '40px'}}
                        type='number'
                        className='form-control'
                        value={p.count}
                        onChange={handleQuantityChange}
                    />
                </td>
                <td className='text-center'>
                        {p.shipping === 'Yes' ? (
                            <CheckCircleOutlined className='text-success'/>
                        ) : (
                            <CloseCircleOutlined className='text-danger' />
                        )}
                    </td>
                <td className='text-center'>
                    <CloseCircleOutlined
                        onClick={handleRemove}
                        className='text-danger pointer'
                    />
                </td>
            </tr>
        </tbody>
    );
};

export default ProductCardInCheckout;
