import React, {useState, useEffect} from 'react';
import AdminNav from '../../../Layout/nav/AdminNav';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import {createProduct} from '../../../functions/product.function';
import {LoadingOutlined} from '@ant-design/icons';
import './style.css';
import ProductCreateForm from '../../../Layout/Forms/ProductCreateForm';
import { getCategories, getCategorySubcategories } from '../../../functions/category.function';
import FileUpload from '../../../Layout/Forms/FileUpload';

const initialState = {
    title: '',
    description: '',
    price: '',
    categories: [],
    category: '',
    subcategory: [],
    shipping: '',
    quantity: '',
    images: [],
    colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
    brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS','Sony','DELL'],
    color: '',
    brand: '',
};

const ProductCreate = () => {
    const { user } = useSelector((state) => ({ ...state }));
    const [values, setValues] = useState(initialState);
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);
    const [showSubCategory, setShowSubCategory] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () =>
        getCategories().then((c) => setValues({ ...values, categories: c.data }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        createProduct(values, user.token)
            .then((res) => {
                setLoading(false);
                console.log(res);
                //window.alert(`${res.data.title} has been created`)
                toast.success('Product added successfully');
                window.location.reload();
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
                //if (err.response.status === 400) toast.error(err.response.data);
                toast.error(err.response.data.err);
            });
    };

    const handleChange = (e) => {
        e.preventDefault();
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (e) => {
        e.preventDefault();
        console.log("CLICKED CATEGORY", e.target.value);
        setValues({ ...values, subcategory: [], category: e.target.value });
        getCategorySubcategories(e.target.value)
            .then((res) => {
                console.log("SUB OPTIONS ON CATEGORY CLICK: ", res);
                setSubCategoryOptions(res.data);
            })
            .catch((err) => {
                console.log('SUB OPTIONS ON CATEGORY CLICK: ', err);
            });
        setShowSubCategory(true);
    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-2'>
                    <AdminNav/>

                </div>
                    <div className='col-md-10'>
                        { loading ? (<h4
                                className='text-danger'
                                style={{textAlign: 'center'}}>
                                <LoadingOutlined />  Loading...
                            </h4>) :
                            (<h4
                                style={{textAlign: 'center'}}>Add New Product
                            </h4>) }
                        <hr />

                        <div className="p-3">
                            <FileUpload
                                values={values}
                                setValues={setValues}
                                setLoading={setLoading}
                            />
                        </div>

                        <ProductCreateForm
                            handleSubmit={handleSubmit}
                            handleChange={handleChange}
                            setValues={setValues}
                            values={values}
                            handleCategoryChange={handleCategoryChange}
                            showSubCategory={showSubCategory}
                            subCategoryOptions={subCategoryOptions}
                        />

                </div>
            </div>
        </div>
    );
}
export default ProductCreate;
