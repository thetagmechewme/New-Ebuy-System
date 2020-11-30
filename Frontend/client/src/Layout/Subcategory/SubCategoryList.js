import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSubCategories } from '../../functions/subcategory.function';
import {LoadingOutlined} from '@ant-design/icons';

const SubCategoryList = () => {
    const [subcategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getSubCategories().then((res) => {
            setSubCategories(res.data);
            setLoading(false);
        });
    },[]);

    const showSubcategories = () =>
        subcategories.map((s) => (
            <div
                key={s._id}
                className='col btn btn-outlined-primary btn-lg btn-block btn-raised m-3'
            >
                <Link to={`/subcategory/${s.slug}`}>{s.name}</Link>
            </div>
        ));

    return (
        <div className='container'>
            <div className='row'>
                {loading ?
                    <h4
                    style={{textAlign: 'center'}}
                    className='text-center'>
                    <LoadingOutlined />  Loading...
                </h4> : showSubcategories()}
            </div>
        </div>
    );
};

export default SubCategoryList;
