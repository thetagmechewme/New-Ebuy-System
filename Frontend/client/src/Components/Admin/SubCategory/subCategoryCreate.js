import React, { useState, useEffect } from 'react';
import AdminNav from '../../../Layout/nav/AdminNav';
import {toast} from 'react-toastify';
import { useSelector } from 'react-redux';
import {createSubCategory, getSubCategories, getSubCategory, removeSubCategory } from '../../../functions/subcategory.function';
import { getCategories } from '../../../functions/category.function';
import {DeleteOutlined, EditOutlined, LoadingOutlined} from '@ant-design/icons';
import './style.css';
import {Link} from 'react-router-dom';
import LocalSearch from '../../../Layout/Forms/LocalSearch';
import CategoryForm from '../../../Layout/Forms/CategoryForm';



const SubCategoryCreate = () => {

    const { user } = useSelector((state) => ({ ...state }));

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [subcategories, setSubCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');

    //Step 1
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        loadCategories();
        loadSubcategories();
    }, []);

    const loadCategories = () =>
        getCategories().then((c) => setCategories(c.data));

    const loadSubcategories = () => getSubCategories().then((s) => setSubCategories(s.data));

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(name);
        setLoading(true);
        createSubCategory({ name, parent: category }, user.token)
            .then((res) => {
                // console.log(res)
                setLoading(false);
                setName('');
                toast.success(`"${res.data.name}" is created`);
                loadSubcategories();
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                if (err.response.status === 400) toast.error(err.response.data);
            });
    };



    const handleRemove = async (slug) => {
        // let answer = window.confirm("Delete?");
        // console.log(answer, slug);
        if (window.confirm('Delete SubCategory?')) {
            setLoading(true);
            removeSubCategory(slug, user.token)
                .then((res) => {
                    setLoading(false);
                    toast.error(`${res.data.name} deleted`);
                    loadSubcategories();
                })
                .catch((err) => {
                    if (err.response.status === 400) {
                        setLoading(false);
                        toast.error(err.response.data);
                    }
                });
        }
    };

    //Step 4
    const search = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

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
                            <LoadingOutlined />  Loading...
                        </h4>) :
                        (<h4
                            style={{textAlign: 'center'}}>Create New SubCategory
                        </h4>) }

                    <div className="form-group">
                        <label>Parent category</label>
                        <select
                            name="category"
                            className="form-control"
                            onChange={(e) => setCategory(e.target.value)}
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

                    <CategoryForm
                        handleSubmit={handleSubmit}
                        name={name}
                        setName={setName}
                    />

                    {/* step 2 and step 3 */}
                    <LocalSearch keyword={keyword} setKeyword={setKeyword} />
                    <hr />
                    {/* step 5 */}
                    {subcategories.filter(search(keyword)).map((s) => (
                        <div className="alert alert-secondary" key={s._id}>
                            {s.name}
                            <span
                                onClick={() => handleRemove(s.slug)}
                                className="btn btn-sm float-right"
                            >
                <DeleteOutlined className="text-danger" />
              </span>
                        <Link to={`/admin/subcategory/${s.slug}`}>
                <span className="btn btn-sm float-right">
                  <EditOutlined className="text-warning" />
                </span>
                            </Link>
                        </div>
                    ))}
                </div>
                <hr/>

            </div>
        </div>
    );
};

export default SubCategoryCreate;
