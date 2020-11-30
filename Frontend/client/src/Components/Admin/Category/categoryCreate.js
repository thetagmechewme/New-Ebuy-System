import React, { useState, useEffect } from "react";
import AdminNav from "../../../Layout/nav/AdminNav";
import {toast} from 'react-toastify';
import { useSelector } from 'react-redux';
import { createCategory, getCategories, removeCategory } from '../../../functions/category.function';
import {DeleteOutlined, EditOutlined, LoadingOutlined} from "@ant-design/icons";
import './style.css';
import {Link} from "react-router-dom";
import CategoryForm from '../../../Layout/Forms/CategoryForm';
import LocalSearch from "../../../Layout/Forms/LocalSearch";



const CategoryCreate = () => {

    const { user } = useSelector((state) => ({ ...state }));

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    //Step 1
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () =>
        getCategories().then((c) => setCategories(c.data));

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(name);
        setLoading(true);
        createCategory({ name }, user.token)
            .then((res) => {
                // console.log(res)
                setLoading(false);
                setName('');
                toast.success(`"${res.data.name}" is created`);
                loadCategories();
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                if (err.response.status === 400) toast.error(err.response.data);
            });
    };


    //Step 4
    const search = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

    const handleRemove = async (slug) => {
        // let answer = window.confirm("Delete?");
        // console.log(answer, slug);
        if (window.confirm('Delete Category?')) {
            setLoading(true);
            removeCategory(slug, user.token)
                .then((res) => {
                    setLoading(false);
                    toast.error(`${res.data.name} deleted`);
                    loadCategories();
                })
                .catch((err) => {
                    if (err.response.status === 400) {
                        setLoading(false);
                        toast.error(err.response.data);
                    }
                });
        }
    };



    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav />
                </div>
                <div className='col'>
                    { loading ? (<h4
                            className='text-danger'
                            style={{textAlign: 'center'}}>
                            <LoadingOutlined />  Creating...
                        </h4>) :
                        (<h4
                            style={{textAlign: 'center'}}>Create New Category
                        </h4>) }

                    <CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} />

                    {/* step 2 and step 3 */}
                    <LocalSearch keyword={keyword} setKeyword={setKeyword} />
                    <hr />
                    {/* step 5 */}
                    {categories.filter(search(keyword)).map((c) => (
                        <div className="alert alert-secondary" key={c._id}>
                            {c.name}
                            <span
                                onClick={() => handleRemove(c.slug)}
                                className="btn btn-sm float-right"
                            >
                <DeleteOutlined className="text-danger" />
              </span>
                            <Link to={`/admin/category/${c.slug}`}>
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

export default CategoryCreate;
