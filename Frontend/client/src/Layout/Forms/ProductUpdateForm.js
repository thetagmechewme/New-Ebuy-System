import React from 'react';
import {Button, Select} from 'antd';
import {RetweetOutlined} from '@ant-design/icons';
import './style.css';

const { Option } = Select;

const ProductUpdateForm = ({
                               handleSubmit,
                               handleChange,
                               setValues,
                               values,
                               handleCategoryChange,
                               categories,
                               subCategoryOptions,
                               arrayOfSubcategories,
                               setArrayOfSubcategories,
                               selectedCategory,
}) => {
    //Destructure
    const {
        title,
        description,
        price,
        category,
        subcategory,
        shipping,
        quantity,
        images,
        colors,
        brands,
        color,
        brand,
    } = values;

    return (
        <form onSubmit={handleSubmit}>
            <label>Product Title
                <input
                    type='text'
                    name='title'
                    className='form-control'
                    value={title}
                    onChange={handleChange}
                    autoFocus
                />
            </label>
            <label>Product Description
                <input
                    type='text'
                    name='description'
                    className='form-control'
                    value={description}
                    onChange={handleChange}
                />
            </label>
            <label>Product Price
                <input
                    type='number'
                    name='price'
                    className='form-control'
                    value={price}
                    onChange={handleChange}
                />
            </label>
            <div className="form-group">
                <label>Product Shipping
                    <select
                        value={shipping === 'Yes' ? 'Yes' : 'No'}
                        name="shipping"
                        className="form-control"
                        onChange={handleChange}
                    >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                    </select>
                </label>
            </div>
            <label>Product Quantity
                <input
                    type='number'
                    name='quantity'
                    className='form-control'
                    value={quantity}
                    onChange={handleChange}
                />
            </label>
            <div className="form-group">
                <label>Product Color
                    <select
                        value={color}
                        name="color"
                        className="form-control"
                        onChange={handleChange}
                    >
                        {colors.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="form-group">
                <label>Product Brand
                    <select
                        value={brand}
                        name='brand'
                        className='form-control'
                        onChange={handleChange}
                    >
                        {brands.map((b) => (
                            <option key={b} value={b}>
                                {b}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="form-group">
                <label>Category
                    <select
                        name='category'
                        className='form-control'
                        onChange={handleCategoryChange}
                        value={selectedCategory ? selectedCategory : category._id}
                    >
                        {categories.length > 0 &&
                        categories.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

                <div>
                    <label>Sub Categories
                        <Select
                            mode="multiple"
                            style={{ width: "100%" }}
                            placeholder="Please select"
                            value={arrayOfSubcategories}
                            onChange={(value) => setArrayOfSubcategories(value)}
                        >
                            {subCategoryOptions.length &&
                            subCategoryOptions.map((s) => (
                                <Option key={s._id} value={s._id}>
                                    {s.name}
                                </Option>
                            ))}
                        </Select>
                    </label>
                </div>

            <br/>

            <Button
                onClick={handleSubmit}
                type='primary'
                block
                shape='round'
                className='mb-3'
                size='large'
                icon={<RetweetOutlined />}>Update Product
            </Button>

        </form>
    );


};
export default ProductUpdateForm;
