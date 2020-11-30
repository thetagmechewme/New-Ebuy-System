import React, { useState, useEffect } from 'react';
import AdminNav from '../../../Layout/nav/AdminNav';
import {toast} from 'react-toastify';
import { useSelector } from 'react-redux';
import { getCategory, updateCategory } from '../../../functions/category.function';
import './style.css';
import {LoadingOutlined} from '@ant-design/icons';
import CategoryForm from '../../../Layout/Forms/CategoryForm';

const CategoryUpdate = ({ history, match }) => {
    const { user } = useSelector((state) => ({ ...state }));
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCategory();
    }, []);

    const loadCategory = () =>
        getCategory(match.params.slug).then((c) => setName(c.data.name));

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        updateCategory(match.params.slug, {name}, user.token)
            .then((res) => {
                setLoading(false);
                setName('');
                toast.success(`'${res.data.name}' is updated`);
                history.push('/admin/category');
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                if (err.response.status === 400) toast.error(err.response.data);
            });
    };


    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-2'>
                    <AdminNav />
                </div>
                <div className='col'>
                    { loading ? (<h4
                            className='text-danger'
                            style={{textAlign: 'center'}}>
                            <LoadingOutlined />  Updating...
                        </h4>) :
                        (<h4
                            style={{textAlign: 'center'}}>Update Category
                        </h4>) }
                    <CategoryForm
                        handleSubmit={handleSubmit}
                        name={name}
                        setName={setName}
                    />
                    <hr />
                </div>
            </div>
        </div>
    );

};
export default CategoryUpdate;

