import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {Button} from 'antd';
import { getCoupons, removeCoupon, createCoupon } from '../../../functions/coupon.function';
import {DeleteOutlined, LoadingOutlined, PlusCircleOutlined} from '@ant-design/icons';
import AdminNav from '../../../Layout/nav/AdminNav';

const CreateCouponPage = () => {
    const [name, setName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [discount, setDiscount] = useState('');
    const [loading, setLoading ] = useState('');
    const [coupons, setCoupons] = useState([]);

    const { user } = useSelector((state) => ({...state}));

    useEffect(() => {
        loadAllCoupons();
    },[]);

    const loadAllCoupons = () =>
        getCoupons().then((res) => setCoupons(res.data));

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        console.table(name, expiry, discount);
        createCoupon({ name, expiry, discount }, user.token)
            .then((res) => {
                setLoading(false);
                loadAllCoupons();
                setName('');
                setDiscount('');
                setExpiry('');
                toast.success(`${res.data.name} is created.`);
            })
            .catch((err) => console.log('Create coupon err', err));
    };

    const handleRemove = (couponId) => {
        if(window.confirm('Delete Coupon?')){
            setLoading(true);
            removeCoupon(couponId, user.token)
                .then((res) => {
                    loadAllCoupons();
                    setLoading(false);
                    toast.error(`Coupon ${res.data.name} is deleted`);
                })
                .catch((err) => console.log(err));
        }
    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-2'>
                    <AdminNav />
                </div>
                <div className='col-md-10'>
                    {loading ? (
                        <h4
                            style={{textAlign: 'center'}}
                            className="text-danger"> <LoadingOutlined />Loading...</h4>
                    ) : (
                        <h4 style={{textAlign: 'center'}}>Coupon</h4>
                    )}
                    <form onSubmit={handleSubmit}>
                            <div className='form-group'>
                                <label className='text-muted'>Coupon Name
                                    <input
                                        type='text'
                                        className='form-control'
                                        value={name}
                                        placeholder='Enter coupon name'
                                        onChange={(e) =>setName(e.target.value)}
                                        autoFocus
                                        required
                                    />
                                </label>
                            </div>

                        <div className='form-group'>
                            <label className='text-muted'>Discount %
                                <input
                                    type='text'
                                    placeholder='Enter discount'
                                    className='form-control'
                                    value={discount}
                                    onChange={(e) =>setDiscount(e.target.value)}
                                    required
                                />
                            </label>
                        </div>

                        <div className='form-group'>
                            <label className='text-muted'>Coupon Expiry</label>
                                <DatePicker
                                    className='form-control'
                                    selected={new Date()}
                                    value={expiry}
                                    onChange={(date) => setExpiry(date)}
                                    required
                                />
                        </div>
                        <Button
                            onClick={handleSubmit}
                            type='primary'
                            block
                            shape='round'
                            className='mb-3'
                            size='large'
                            icon={<PlusCircleOutlined />}>Save
                        </Button>
                    </form>
                    <br/>
                    <h4>{coupons.length} Coupons</h4>
                    <table className='table table-bordered'>
                        <thead className='thead-light'>
                        <tr>
                            <th scope='col'>Name</th>
                            <th scope='col'>Expiry</th>
                            <th scope='col'>Discount</th>
                            <th scope='col'>Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {coupons.map((c) => (
                            <tr key={c._id}>
                                <td>{c.name}</td>
                                <td>{new Date(c.expiry).toLocaleDateString()}</td>
                                <td>{c.discount}%</td>
                                <td>
                                    <DeleteOutlined
                                        onClick={() => handleRemove(c._id)}
                                        className='text-danger pointer'
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CreateCouponPage;
