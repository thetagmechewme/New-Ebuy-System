import React, { useState, useEffect } from 'react';
import UserNav from '../../Layout/nav/UserNav';
import { getUserOrders } from '../../functions/user.function';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import ShowPaymentInfo from '../../Layout/Cards/ShowPaymentInfo';
import Invoice from '../../Layout/Order/Invoice';
import {PDFDownloadLink} from "@react-pdf/renderer";

const History = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useSelector((state) => ({...state}));

    useEffect(() => {
        loadUserOrders();
    },[]);

    const loadUserOrders = () =>
        getUserOrders(user.token).then((res) => {
            console.log(JSON.stringify(res.data, null, 4));
            setOrders(res.data);
        });

    const showOrdersInTable = (order) => (
        <table className='table table-bordered'>
            <thead className='thead-light'>
            <tr>
                <th scope='col'>Title</th>
                <th scope='col'>Price</th>
                <th scope='col'>Brand</th>
                <th scope='col'>Color</th>
                <th scope='col'>Quantity</th>
                <th scope='col'>Shipping</th>
            </tr>
            </thead>

            <tbody>
            {order.products.map((p, i) => (
                <tr key={i}>
                    <td>
                        <b>{p.product.title}</b>
                    </td>
                    <td>{p.product.price}</td>
                    <td>{p.product.brand}</td>
                    <td>{p.color}</td>
                    <td>{p.count}</td>
                    <td>
                        {p.product.shipping === 'Yes' ? (
                            <CheckCircleOutlined style={{ color: 'green' }} />
                        ) : (
                            <CloseCircleOutlined style={{ color: 'red' }} />
                        )}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );

    const showDownloadLink = (order) => (
        <PDFDownloadLink
            document={<Invoice order={order} />}
            fileName='invoice.pdf'
            className='btn btn-sm btn-block btn-outline-primary'
        >
            Download Invoice.pdf
        </PDFDownloadLink>
    );

    const showEachOrders = () =>
        orders.map((order, i) => (
            <div key={i} className='m-5 p-3 card'>
                <ShowPaymentInfo order={order} />
                {showOrdersInTable(order)}
                <div className='row'>
                    <div className='col'>
                        {showDownloadLink(order)}
                    </div>
                </div>
            </div>
        ));

    return(
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-2'>
                    <UserNav />
                </div>
                <div className='col text-center'>
                    <h4>
                        {orders.length > 0 ? 'User Purchase Orders' : 'No Purchase Orders'}
                    </h4>
                    {showEachOrders()}
                </div>
            </div>
        </div>
    );
};
export default History;
