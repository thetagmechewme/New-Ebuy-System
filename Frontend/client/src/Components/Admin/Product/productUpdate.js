import React, { useEffect, useState } from 'react';
import AdminNav from '../../../Layout/nav/AdminNav';
import { toast } from 'react-toastify';
import {useSelector} from 'react-redux';
import FileUpload from '../../../Layout/Forms/FileUpload';
import {getProduct, updateProduct} from '../../../functions/product.function';
import {getCategories, getCategorySubcategories} from '../../../functions/category.function';
import ProductUpdateForm from '../../../Layout/Forms/ProductUpdateForm';
import {LoadingOutlined} from '@ant-design/icons';

const initialState = {
    title: '',
    description: '',
    price: '',
    category: '',
    subcategory: [],
    shipping: '',
    quantity: '',
    images: [],
    colors: ['Black', 'Brown', 'Silver', 'White', 'Blue'],
    brands: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS','Sony'],
    color: '',
    brand: '',
};

const ProductUpdate = ({match, history}) => {
    const [values, setValues] = useState(initialState);
    const [categories, setCategories] = useState([]);
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);
    const [arrayOfSubcategories, setArrayOfSubcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading]  =useState(false);
    const { user } = useSelector((state) => ({ ...state }));
    const { slug } = match.params;

    useEffect(() => {
        loadProduct();
        loadCategories();
    },[]);

    const loadProduct = () => {
        getProduct(slug)
            .then((p) => {
                console.log('Single product: ', p);
                //1. Load single product
                setValues({ ...values, ...p.data });
                //2. Load single product category subs
                getCategorySubcategories(p.data.category._id).then((res) => {
                    setSubCategoryOptions(res.data) //show default subcategories on first load
                });
                //3. Prepare array of subcategory ids to show as default sub values
                let arr = [];
                p.data.subcategory.map((s) =>{
                    arr.push(s._id);
                });
                console.log('ARR: ', arr);
                setArrayOfSubcategories((prev) => arr); //Required for ant design to work
            });
    };
    const loadCategories = () => {
        getCategories().then((c) => {
            console.log('"GET CATEGORIES IN UPDATE PRODUCT: ', c.data);
            setCategories(c.data);
        })
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        values.subcategory = arrayOfSubcategories;
        values.category = selectedCategory ? selectedCategory : values.category;

        updateProduct(slug, values, user.token)
            .then((res) => {
                setLoading(false);
                toast.success(`${res.data.title} is updated`);
                history.push('/admin/products');
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                toast.error(err.response.data.err);
            });
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (e) => {
        e.preventDefault();
        console.log('Clicked Category: ', e.target.value);
        setValues({ ...values, subcategory: []});
        setSelectedCategory({...values, subcategory:[]});
        getCategorySubcategories(e.target.value)
            .then((res) => {
                console.log("SUB OPTIONS ON CATEGORY CLICK: ", res);
                setSubCategoryOptions(res.data);
            });
        console.log('EXISTING CATEGORY values.category: ', values.category);

        //Show default subcategories when user click to the original category
        if(values.category._id === e.target.value){
            loadProduct();
        }
        //Clear old subcategory Ids
        setArrayOfSubcategories([]);
    };


    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>

                <div className="col-md-10">
                    { loading ? (<h4
                            className='text-danger'
                            style={{textAlign: 'center'}}>
                            <LoadingOutlined />  Loading...
                        </h4>) :
                        (<h4
                            style={{textAlign: 'center'}}>Update Product
                        </h4>) }
                    {/*JSON.stringify(values)*/}
                    <div className='p-3'>
                        <FileUpload
                            values={values}
                            setValues={setValues}
                            setLoading={setLoading}
                        />
                    </div>

                    <ProductUpdateForm
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        setValues={setValues}
                        values={values}
                        handleCategoryChange={handleCategoryChange}
                        categories={categories}
                        subCategoryOptions={subCategoryOptions}
                        arrayOfSubcategories={arrayOfSubcategories}
                        setArrayOfSubcategories={setArrayOfSubcategories}
                        selectedCategory={selectedCategory}
                    />
                    <hr />
                </div>
            </div>
        </div>
    );

};
export default ProductUpdate;
