import React, { useState } from 'react';
import {Card, Tabs, Tooltip} from 'antd';
import { Link } from 'react-router-dom';
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ps5 from '../../images/ps5.jpg';
import ProductListItems from './ProductListItems';
import StarRating from 'react-star-ratings';
import RatingModal from '../Modal/RatingModal';
import { showAverage } from '../../functions/rating.function';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import {cartConst} from '../../actions/constants';
import { addToWishlist } from '../../functions/user.function';
import {toast} from "react-toastify";

const { TabPane } = Tabs;

const SingleProduct = ({ product, onStarClick, star, history }) => {
    const [tooltip, setTooltip] = useState('Click to add');
    const { user, cart } = useSelector((state) => ({...state}));
    const dispatch = useDispatch();

    const { title, images, description, _id } = product;

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
        }
    };
    const handleAddToWishlist = (e) => {
        e.preventDefault();
        addToWishlist(product._id, user.token).then((res) => {
            console.log('ADDED TO WISHLIST', res.data);
            toast.success('Added to wishlist');
            history.push('/user/wishlist');
        });
    };

    return (
        <>
            <div className='col-md-7'>
                {images && images.length ? (
                    <Carousel showArrows={true} autoPlay infiniteLoop>
                        {images && images.map((i) => <img src={i.url} key={i.public_id}  alt='default'/>)}
                    </Carousel>
                ) : (
                    <Card cover={<img src={ps5} className="mb-3 card-image" alt='default'/>}/>
                )}
                <Tabs type='card'>
                    <TabPane tab='Description' key='1'>
                        { description && description }
                    </TabPane>
                    <TabPane tab='More' key='2'>
                        Call Us on 0723000000 to learn more about this product
                    </TabPane>
                </Tabs>
            </div>

            <div className='col-md-5'>
                <h3 className='bg-inverse p-3'>{ title }</h3>

                {product && product.ratings && product.ratings.length > 0
                ? showAverage(product)
                : (
                    <div className='text-center pt-1 pb-3'>No rating yet</div>
                    )}

                <Card
                    actions={[
                        <Tooltip title={tooltip}>
                            <a onClick={handleAddToCart} disabled={product.quantity < 1}>
                                <ShoppingCartOutlined className='text-success' />
                                <br />
                                {product.quantity < 1 ? 'Out of Stock' : 'Add To Cart'}
                            </a>
                        </Tooltip>,
                        <a onClick={handleAddToWishlist}>
                            <HeartOutlined className='text-info' /> <br /> Add to Wishlist
                        </a>,
                        <RatingModal>
                            <StarRating
                                name={_id}
                                numberOfStars={5}
                                rating={star}
                                starDimension='30px'
                                changeRating={onStarClick}
                                isSelectable={true}
                                starRatedColor='#f48c06'
                            />
                        </RatingModal>,
                    ]}
                >
                    <ProductListItems product={product} />
                </Card>
            </div>
        </>
    );
};

export default SingleProduct;
