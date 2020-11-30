import React from 'react';
import {Button, Select} from "antd";
import {PlusCircleOutlined} from "@ant-design/icons";
import './style.css';

const { Option } = Select;


const ProductCreateForm = ({ handleSubmit, handleChange, values, handleCategoryChange, showSubCategory, subCategoryOptions, setValues }) => {
    const {
        title,
        description,
        price,
        categories,
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
                <label>Product Shipping</label>
                <select
                    name="shipping"
                    className="form-control"
                    onChange={handleChange}
                >
                    <option>Please select</option>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                </select>
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
                <label>Product Color</label>
                <select
                    name="color"
                    className="form-control"
                    onChange={handleChange}
                >
                    <option>Please select</option>
                    {colors.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Product Brand</label>
                <select
                    name="brand"
                    className="form-control"
                    onChange={handleChange}
                >
                    <option>Please select</option>
                    {brands.map((b) => (
                        <option key={b} value={b}>
                            {b}
                        </option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Category</label>
                <select
                    name="category"
                    className="form-control"
                    onChange={handleCategoryChange}
                >
                    <option>Please select</option>
                    {categories.length > 0 &&
                    categories.map((c) => (
                        <option key={c._id} value={c._id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            {showSubCategory && (
            <div>
                <label>Sub Categories</label>
                <Select
                    mode="multiple"
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    value={subcategory}
                    onChange={(value) => setValues({ ...values, subcategory: value })}
                >
                    {subCategoryOptions.length &&
                    subCategoryOptions.map((s) => (
                        <Option key={s._id} value={s._id}>
                            {s.name}
                        </Option>
                    ))}

                </Select>
            </div>
            )}
            <br/>
            <Button
                onClick={handleSubmit}
                type='primary'
                block
                shape='round'
                className='mb-3'
                size='large'
                icon={<PlusCircleOutlined />}>Add Product
            </Button>

        </form>
    );

};
export default ProductCreateForm;
