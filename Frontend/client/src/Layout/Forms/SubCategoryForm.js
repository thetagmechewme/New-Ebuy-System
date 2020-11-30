import React from 'react';
import {Button} from "antd";
import {PlusCircleOutlined} from "@ant-design/icons";
import './style.css';

const SubCategoryForm = ({handleSubmit, name, setName}) => (
    <form onSubmit={handleSubmit}>
        <label>Sub Category Name
            <input
                type='text'
                className='form-control'
                placeholder='Enter New Category Name'
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
            />
        </label>
        <Button
            onClick={handleSubmit}
            type='primary'
            block
            shape='round'
            className='mb-3'
            size='large'
            disabled={!name}
            icon={<PlusCircleOutlined />}>Create Category
        </Button>
    </form>
)
export default SubCategoryForm;
