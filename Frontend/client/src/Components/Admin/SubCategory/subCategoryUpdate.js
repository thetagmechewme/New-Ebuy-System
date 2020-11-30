import React, { useState, useEffect } from "react";
import AdminNav from "../../../Layout/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {getSubCategory, updateSubCategory } from '../../../functions/subcategory.function';
import { Link } from "react-router-dom";
import {LoadingOutlined} from "@ant-design/icons";
import { getCategories } from '../../../functions/category.function';
import LocalSearch from "../../../Layout/Forms/LocalSearch";
import CategoryForm from "../../../Layout/Forms/CategoryForm";

const SubCategoryUpdate = ({ match, history }) => {
    const { user } = useSelector((state) => ({ ...state }));

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [parent, setParent] = useState('');

    useEffect(() => {
        loadCategories();
        loadSubCategories();
    }, []);

    const loadCategories = () =>
        getCategories().then((c) => setCategories(c.data));

    const loadSubCategories = () =>
        getSubCategory(match.params.slug).then((s) => {
            setName(s.data.name);
            setParent(s.data.parent);
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(name);
        setLoading(true);
        updateSubCategory(match.params.slug, { name, parent }, user.token)
            .then((res) => {
                // console.log(res)
                setLoading(false);
                setName('');
                toast.success(`'${res.data.name}' is updated`);
                history.push('/admin/subcategory');
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
                            style={{textAlign: 'center'}}>Update SubCategory
                        </h4>) }

                    <div className='form-group'>
                        <label>Parent category</label>
                        <select
                            name='category'
                            className='form-control'
                            onChange={(e) => setParent(e.target.value)}
                        >
                            <option>Please select</option>
                            {categories.length > 0 &&
                            categories.map((c) => (
                                <option key={c._id} value={c._id} selected={c._id === parent}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <CategoryForm
                        handleSubmit={handleSubmit}
                        name={name}
                        setName={setName}
                    />
                </div>
            </div>
        </div>
    );
};

export default SubCategoryUpdate;
