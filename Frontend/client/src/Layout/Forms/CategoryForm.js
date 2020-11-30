import React from 'react';
import {Button} from "antd";
import {PlusCircleOutlined} from "@ant-design/icons";
import './style.css';

const CategoryForm = ({handleSubmit, name, setName}) => (
    <div className="form-group">
    <form onSubmit={handleSubmit}>
            <div className='form-group'>
                <label>Category Name
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Enter New Category Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        required
                    />
                </label>
            </div>
            <Button
                onClick={handleSubmit}
                type='primary'
                block
                shape='round'
                className='mb-3'
                size='large'
                disabled={!name}
                icon={<PlusCircleOutlined />}>Save
            </Button>
        </form>
    </div>
)
export default CategoryForm;
