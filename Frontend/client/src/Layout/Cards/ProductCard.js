import React, { useState } from 'react';
import {Card, Tooltip} from 'antd';
import {EyeOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import ps5 from '../../images/ps5.jpg';
import { Link } from 'react-router-dom';
import { showAverage } from '../../functions/rating.function';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import {cartConst, drawerConst} from '../../actions/constants';

const { Meta } = Card;

const ProductCard = ({product}) => {
    const [tooltip, setTooltip] = useState('Click to add');
    const { user, cart } = useSelector((state) => ({...state}));
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        //Create cart array
        let cart = [];
        if (typeof  window !== 'undefined'){
            //If cart is in localStorage GET item
            if(localStorage.getItem('cart')){
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            //Push new product to cart
            cart.push({
                ...product,
                count: 1,
            });
            //remove duplicates
            let unique = _.uniqWith(cart, _.isEqual);
            //Save to localStorage
            localStorage.setItem('cart', JSON.stringify(unique));
            //Show tooltip
            setTooltip('Added');
            //Add to redux state
            dispatch({
                type: cartConst.ADD_TO_CART,
                payload: unique,
            });
            //Show cart items on side drawer
            dispatch({
                type: drawerConst.SET_VISIBLE,
                payload: true,
            });
        }
    };


    //destructure
    const { images, title, description, slug, price } = product;
    return (
        <>
            {product && product.ratings && product.ratings.length > 0 ? (
                showAverage(product)
            ) : (
                <div className="text-center pt-1 pb-3">No rating yet</div>
            )}
            <Card
                cover={
                    <img
                        src={images && images.length ? images[0].url : ps5}
                        style={{ height: '150px', objectFit: 'contain' }}
                        className='p-1'
                        alt='product'
                    />
                }
                actions={[
                    <Link to={`/product/${slug}`}>
                        <EyeOutlined className='text-success' /> <br/> View Product
                    </Link>,

                    <Tooltip title={tooltip}>
                        <a onClick={handleAddToCart} disabled={product.quantity < 1} >
                            <ShoppingCartOutlined className='text-danger' /> <br/>
                            {product.quantity < 1 ? 'Out of Stock' : 'Add To Cart'}
                        </a>
                    </Tooltip>,
                ]}
            >
                <Meta
                    title={`${title} - Ksh ${price}`}
                    description={`${description && description.substring(0, 40)}...`}
                />
            </Card>
        </>
    );
};

export default ProductCard;
