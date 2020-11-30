import React, { useEffect, useState } from 'react';
import { getProductsByCount, fetchProductsByFilter } from '../functions/product.function';
import { getCategories } from '../functions/category.function';
import { getSubCategories } from '../functions/subcategory.function';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../Layout/Cards/ProductCard';
import {DollarOutlined, LoadingOutlined, DownCircleOutlined, StarOutlined} from '@ant-design/icons';
import {searchFilter} from '../actions/constants';
import {Checkbox, Menu, Radio, Slider} from 'antd';
import Star from '../Layout/Forms/Star';

const { SubMenu, ItemGroup } = Menu;

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState([0, 0]);
    const [ok, setOk] = useState(false)
    const [categories, setCategories] = useState([]);
    const [categoryIds, setCategoryIds] = useState([]);
    const [star, setStar] = useState('');
    const [subcategories, setSubcategories] = useState([]);
    const [subcategory, setSubcategory] = useState('');
    const [brands, setBrands] = useState([
        'Apple',
        'Samsung',
        'Microsoft',
        'Lenovo',
        'ASUS',
        'Sony',
        'DELL',
    ]);
    const [brand, setBrand] = useState('');
    const [colors, setColors] = useState([
        'Black',
        'Brown',
        'Silver',
        'White',
        'Blue',
    ]);
    const [color, setColor] = useState('');
    const [shipping, setShipping] = useState('');

    let dispatch = useDispatch();
    let { search } = useSelector((state) => ({...state}));
    const { text } = search;

    useEffect(() => {
        loadAllProducts();
        //fetch categories
        getCategories().then((res) => setCategories(res.data));
        //fetch subcategories
        getSubCategories().then((res) => setSubcategories(res.data));
    },[]);

    const fetchProducts = (arg) => {
        fetchProductsByFilter(arg).then((res) => {
            setProducts(res.data);
        });
    };

    // 1. load products by default on page load
    const loadAllProducts = () => {
        getProductsByCount(12).then((p) => {
            setProducts(p.data);
            setLoading(false);
        });
    };

    //2. Load products on user search input
    useEffect(() => {
        const delayed = setTimeout(() =>{
            fetchProducts({ query: text });
            if (!text){
                loadAllProducts();
            }
        }, 300);
        return () => clearTimeout(delayed);
    }, [text]);

    //3. Load products based on price range
    useEffect(() => {
        console.log('Ok to request');
        fetchProducts({ price });
    },[ok]);

    const handleSlider = (value) => {
        dispatch({
            type: searchFilter.SEARCH_QUERY,
            payload: { text: '' },
        });
        //Reset
        setCategoryIds([]);
        setPrice(value);
        setStar('');
        setSubcategory('');
        setBrand('');
        setTimeout(() => {
            setOk(!ok);
        }, 300);
    };

    //4.Load product based on category
    //Show categories in a list of checkbox
    const showCategories = () =>
        categories.map((c) => (
            <div key={c._id}>
                <Checkbox
                    onChange={handleCheck}
                    className='pb-2 pl-4 pr-4'
                    value={c._id}
                    name='category'
                    checked={categoryIds.includes(c._id)}
                >
                    {c.name}
                </Checkbox>
                <br/>
            </div>
        ));

    //handleCheck function for categories
    const handleCheck = (e) => {
        dispatch({
            type: searchFilter.SEARCH_QUERY,
            payload: { text: '' },
        });
        setPrice([0, 0]);
        setStar('');
        setSubcategory('');
        setBrand('');

        let inTheState = [...categoryIds];
        let justChecked = e.target.value;
        let foundInTheState = inTheState.indexOf(justChecked);

        // indexOf method ?? if not found returns -1 else return index [1,2,3,4,5]
        if (foundInTheState === -1) {
            inTheState.push(justChecked);
        } else {
            // if found pull out one item from index
            inTheState.splice(foundInTheState, 1);
        }

        setCategoryIds(inTheState);
        // console.log(inTheState);
        fetchProducts({ category: inTheState });
    };
    //5. Show products based on star rating
    const handleStarClick = (num) => {
        console.log(num);

        dispatch({
            type: searchFilter.SEARCH_QUERY,
            payload: { text: '' },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar(num);
        setSubcategory('');
        setBrand('');
        fetchProducts({ stars: num });
    };

    const showStars = () => (
        <div className='pr-4 pl-4 pb-2'>
            <Star starClick={handleStarClick} numberOfStars={5} />
            <Star starClick={handleStarClick} numberOfStars={4} />
            <Star starClick={handleStarClick} numberOfStars={3} />
            <Star starClick={handleStarClick} numberOfStars={2} />
            <Star starClick={handleStarClick} numberOfStars={1} />
        </div>
    );

    //6. Show products based on subcategory
    const showSubcategories = () =>
        subcategories.map((s) => (
            <div
                key={s._id}
                onClick={() => handleSubcategory(s)}
                className='p-1 m-1 badge badge-secondary'
                style={{ cursor: 'pointer' }}
            >
                {s.name}
            </div>
        ));

    const handleSubcategory = (subcategory) => {
        console.log('Subcategory: ', subcategory);
        setSubcategory(subcategory);
        dispatch({
            type: searchFilter.SEARCH_QUERY,
            payload: { text: '' },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('');
        setBrand('');
        fetchProducts({ subcategory });
        loadAllProducts();
    };

    //7 Show products based on brands
    const showBrands = () =>
        brands.map((b) => (
            <Radio
                value={b}
                name={b}
                checked={b === brand}
                onChange={handleBrand}
                className='pb-1 pl-4 pr-4'
            >
                {b}
            </Radio>
        ));

    const handleBrand = (e) => {
        setSubcategory('');
        dispatch({
            type: searchFilter.SEARCH_QUERY,
            payload: { text: '' },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('');
        setBrand(e.target.value);
        fetchProducts({brand: e.target.value});
        loadAllProducts();
    };
    //8. Show products based on color
    const showColors = () =>
        colors.map((c) => (
            <Radio
                value={c}
                name={c}
                checked={c === color}
                onChange={handleColor}
                className='pb-1 pl-4 pr-4'
            >
                {c}
            </Radio>
        ));
    const handleColor = (e) => {
        setSubcategory('');
        dispatch ({
            type: searchFilter.SEARCH_QUERY,
            payload: { text: '' },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('');
        setBrand('');
        setColor(e.target.value);
        setShipping('');
        fetchProducts({ color: e.target.value });
    };
    //9. Show products based on shipping (Yes/No)
    const showShipping = () => (
        <>
            <Checkbox
                className='pb-2 pl-4 pr-4'
                onChange={handleShippingChange}
                value='Yes'
                checked={shipping === 'Yes'}
            >
                Yes
            </Checkbox>

            <Checkbox
                className='pb-2 pl-4 pr-4'
                onChange={handleShippingChange}
                value='No'
                checked={shipping === 'No'}
            >
                No
            </Checkbox>
        </>
    );

    const handleShippingChange = (e) => {
        setSubcategory('');
        dispatch({
            type: searchFilter.SEARCH_QUERY,
            payload: { text: '' },
        });
        setPrice([0, 0]);
        setCategoryIds([]);
        setStar('');
        setBrand('');
        setColor('');
        setShipping(e.target.value);
        fetchProducts({ shipping: e.target.value });
    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-3 pt-2'>
                    <h4>Search/Filter Products</h4>
                    <hr />

                    <Menu defaultOpenKeys={['1', '2']} mode='inline'>
                        {/* Price */}
                        <SubMenu
                            key='1'
                            title={
                                <span className='h6'>
                  <DollarOutlined /> Price (Ksh)
                </span>
                            }
                        >
                            <div>
                                <Slider
                                    className='ml-4 mr-4'
                                    tipFormatter={(v) => `$${v}`}
                                    range
                                    value={price}
                                    onChange={handleSlider}
                                    max='299999'
                                />
                            </div>
                        </SubMenu>

                        {/* Category */}
                        <SubMenu
                            key='2'
                            title={
                                <span className='h6'>
                                    <DownCircleOutlined /> Categories
                                </span>
                            }
                        >
                            <div style={{ marginTop: '-10px' }}>{showCategories()}</div>
                        </SubMenu>
                        {/* Stars */}
                        <SubMenu
                            key='3'
                            title={
                                <span className='h6'>
                  <StarOutlined /> Rating
                </span>
                            }
                        >
                            <div style={{ marginTop: '-10px' }}>{showStars()}</div>
                        </SubMenu>
                        {/* Sub Category */}
                        <SubMenu
                            key='4'
                            title={
                                <span className='h6'>
                  <DownCircleOutlined /> Sub Categories
                </span>
                            }
                        >
                            <div style={{ marginTop: '-10px' }} className='pl-4 pr-4'>
                                {showSubcategories()}
                            </div>
                        </SubMenu>
                        {/* Brands */}
                        <SubMenu
                            key='5'
                            title={
                                <span className='h6'>
                  <DownCircleOutlined /> Brands
                </span>
                            }
                        >
                            <div style={{ marginTop: '-10px' }} className='pr-5'>
                                {showBrands()}
                            </div>
                        </SubMenu>

                        {/* colors */}
                        <SubMenu
                            key='6'
                            title={
                                <span className='h6'>
                  <DownCircleOutlined /> Colors
                </span>
                            }
                        >
                            <div style={{ marginTop: '-10px' }} className='pr-5'>
                                {showColors()}
                            </div>
                        </SubMenu>

                        {/* shipping */}
                        <SubMenu
                            key='7'
                            title={
                                <span className='h6'>
                  <DownCircleOutlined /> Shipping
                </span>
                            }
                        >
                            <div style={{ marginTop: '-10px' }} className='pr-5'>
                                {showShipping()}
                            </div>
                        </SubMenu>
                    </Menu>
                </div>

                <div className='col-md-9 pt-2'>
                    {loading ? (
                        <h4
                            style={{textAlign: 'center'}}
                            className='text-danger'>
                            <LoadingOutlined />Loading...</h4>
                    ) : (
                        <h4 className='text-danger'>Products</h4>
                    )}

                    {products.length < 1 && <p>No products found</p>}

                    <div className='row pb-5'>
                        {products.map((p) => (
                            <div key={p._id} className='col-md-4 mt-3'>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

};
export default Shop;
