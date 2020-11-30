import React from 'react';
import { Drawer, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import ps5 from '../../images/ps5.jpg';
import {drawerConst} from '../../actions/constants';
import {ShoppingCartOutlined} from '@ant-design/icons';

const SideDrawer = () => {
    const dispatch = useDispatch();
    const { drawer, cart } = useSelector((state) => ({...state}));

    const imageStyle = {
        width: '70px',
        height: '50px',
        objectFit: 'contain'
    };

    return (
        <Drawer
            className='text-center'
            title={`Cart / ${cart.length} Product`}
            placement='right'
            closable={false}
            onClose={() => {
                dispatch({
                    type: drawerConst.SET_VISIBLE,
                    payload: false,
                });
            }}
            visible={drawer}
        >
            {cart.map((p) => (
                <div key={p._id} className='row'>
                    <div className='col'>
                        {p.images[0] ? (
                            <>
                                <img src={p.images[0].url} style={imageStyle} />
                                <p className='text-center bg-secondary text-light'>
                                    {p.title} x {p.count}
                                </p>
                            </>
                        ) : (
                            <>
                                <img src={ps5} style={imageStyle} />
                                <p className='text-center bg-secondary text-light'>
                                    {p.title} x {p.count}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            ))}

            <Link to='/cart'>
                <Button
                    onClick={() =>
                        dispatch({
                            type: drawerConst.SET_VISIBLE,
                            payload: false,
                        })
                    }
                    type='primary'
                    block
                    shape='round'
                    className='mb-3'
                    icon={<ShoppingCartOutlined />}>Go to Cart
                </Button>
            </Link>
        </Drawer>
    );
};
export default SideDrawer;
