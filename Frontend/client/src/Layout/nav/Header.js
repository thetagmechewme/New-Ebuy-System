import React, {useState} from 'react';
import {Badge, Menu} from 'antd';
import {
    DashboardOutlined,
    LogoutOutlined,
    SettingOutlined,
    ShopOutlined, ShoppingCartOutlined,
    ShoppingOutlined,
    UserAddOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import {useDispatch, useSelector} from 'react-redux';
import { useHistory } from 'react-router-dom';
import {userConst} from "../../actions/constants";
import Search from '../Forms/Search';

const {SubMenu, Item} = Menu;

const Header = () => {
    const [current, setCurrent] = useState('home');
    let dispatch = useDispatch();
    let {user, cart} = useSelector((state) => ({...state}));
    let history = useHistory();
    const handleClick = (e) => {
        //console.log(e.key);
        setCurrent(e.key);
    };

    const logout = () => {
        firebase.auth().signOut()
        dispatch({
            type: userConst.LOGOUT,
            payload: null,
        });
        //Redirect user to Login after logging out
        history.push('/login');
    };

    return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode='horizontal'>
            <Item key='home' icon={<ShopOutlined />}>
                <Link to='/'>Ebuy</Link>
            </Item>

            <Item key='shop' icon={<ShoppingOutlined />}>
                <Link to='/shop'>Shop</Link>
            </Item>

            <Item key='cart' icon={<ShoppingCartOutlined />}>
                <Link to='/cart'>
                    <Badge count={cart.length} offset={[9, 0]}>
                        Cart
                    </Badge>
                </Link>
            </Item>

            {!user && (
                <Item key='register' icon={<UserAddOutlined />} className='float-right' >
                    <Link to='/register'>Register</Link>
                </Item>
            )}
            {!user && (
                <Item key='login' icon={<UserOutlined />} className='float-right' >
                    <Link to='/login'>Login</Link>
                </Item>
            )}
            {user && (
                <SubMenu
                    key='SubMenu'
                    icon={<SettingOutlined />}
                    title={user.email && user.email.split('@')[0]}
                    className='float-right' >
                    {user && user.role === 'User' && (
                        <Item icon={<DashboardOutlined />}>
                            <Link to='/user/history'>Dashboard</Link>
                        </Item>
                    )}

                    {user && user.role === "Admin" && (
                        <Item icon={<DashboardOutlined />}>
                            <Link to='/admin/dashboard'>Dashboard</Link>
                        </Item>
                    )}
                    <Item icon={<LogoutOutlined />} onClick={logout} >Logout</Item>
                </SubMenu>
            )}

            <span className='float-right p-1'>
                <Search />
            </span>

        </Menu>
    );
}
export default Header;
