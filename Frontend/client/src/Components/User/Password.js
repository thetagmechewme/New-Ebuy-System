import React, {useState} from 'react';
import UserNav from "../../Layout/nav/UserNav";
import './style.css';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import {RetweetOutlined, LoadingOutlined} from "@ant-design/icons";
import {Button} from "antd";

const Password = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        //console.log(password);

        await auth.currentUser.updatePassword(password)
            .then(() => {
                setLoading(false)
                setPassword('');
                toast.success('Password has been successfully updated');
            })
            .catch(err => {
                setLoading(false)
                toast.error(err.message);
            })

    };
    const updatePasswordForm = () => (
        <form onSubmit={handleSubmit}>
            <label>Your Password
                <input
                    type='password'
                    className='form-control'
                    placeholder='Enter new password'
                    value={password}
                    disabled={loading}
                    onChange={e => setPassword(e.target.value)}
                />
            </label>
            <Button
                onClick={handleSubmit}
                type='primary'
                block
                shape='round'
                className='mb-3'
                size='large'
                disabled={password.length < 6 || loading }
                icon={<RetweetOutlined />}>Update Password
            </Button>
        </form>
    );

    return(
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-2'>
                    <UserNav />
                </div>
                <div className='col'>
                    { loading ? (<h4
                            className='text-danger'
                            style={{textAlign: 'center'}}>
                            <LoadingOutlined /> Updating Password...
                        </h4>) :
                        (<h4
                            style={{textAlign: 'center'}}>Password Update
                        </h4>) }
                    <br/>
                    <hr/>
                    {updatePasswordForm()}
                </div>
            </div>
        </div>
    );
};
export default Password;
