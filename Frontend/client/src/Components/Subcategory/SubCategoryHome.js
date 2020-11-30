import React, { useState, useEffect } from 'react';
import { getSubCategory } from '../../functions/subcategory.function';
import ProductCard from '../../Layout/Cards/ProductCard';
import {LoadingOutlined} from '@ant-design/icons';

const SubCategoryHome = ({ match }) => {
    const [subcategory, setSubcategory] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { slug } = match.params;

    useEffect(() => {
        setLoading(true);
        getSubCategory(slug).then((res) => {
            console.log(JSON.stringify(res.data, null, 4));
            setSubcategory(res.data.subCat);
            setProducts(res.data.products);
            setLoading(false);
        });
    },[slug]);

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col'>
                    {loading ? (
                        <h4
                            style={{textAlign: 'center'}}
                            className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
                            <LoadingOutlined />  Loading...
                        </h4>
                    ) : (
                        <h4

                            className='text-center p-3 mt-5 mb-5 display-4 jumbotron'>
                            {products.length} Products in '{subcategory.name}' subcategory
                        </h4>
                    )}
                </div>
            </div>

            <div className='row'>
                {products.map((p) => (
                    <div className='col' key={p._id}>
                        <ProductCard product={p} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SubCategoryHome;
