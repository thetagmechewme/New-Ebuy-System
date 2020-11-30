import React, {useEffect, useState} from 'react';
import './style.css';
import {auth} from "../../firebase";
import {toast} from 'react-toastify';
import { useDispatch } from 'react-redux';
import { Button } from 'antd';
import {userConst} from "../../actions/constants";
import {LikeOutlined, LoadingOutlined} from "@ant-design/icons";
import {userCreateUpdate} from "../../functions/auth.function";

const RegisterComplete = ({history}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const { user } = useSelector(state => ({...state}));
    const [loading, setLoading] = useState(false);
    let dispatch = useDispatch();

    useEffect(() => {
        setEmail(window.localStorage.getItem('registrationEmail'));
        // console.log(window.location.href);
        // console.log(window.localStorage.getItem('registrationEmail'));
    }, [history])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        //Email & Password validation
        if(!email || !password){
            toast.error('Password is required to finish registration!');
            return;
        }
        if(password.length < 6){
            toast.error('Password must have more than 6 characters');
            return;
        }
        //toast.success(`The following email ${email} has been verified. Please login!`);
        try{
            const result = await auth.signInWithEmailLink( email, window.location.href );
            console.log('Result: ', result);
            if(result.user.emailVerified){
                //Here I remove user email from window.localstorage
                window.localStorage.removeItem('registrationEmail');
                //Get user ID token
                let user = auth.currentUser
                await user.updatePassword(password);
                const idTokenResult = await user.getIdTokenResult()
                //Populate user through redux store
                userCreateUpdate(idTokenResult.token)
                    .then((res => {
                        dispatch({
                            type: userConst.LOGGED_IN_USER,
                            payload: {
                                name: res.data.name,
                                email: res.data.email,
                                token: idTokenResult.token,
                                role: res.data.role,
                                _id: res.data._id,
                            },
                        });
                    }))
                    .catch(err => console.log(err));
                toast.success(`The email ${email} has been successfully verified!`);
                //Finally redirect
                history.push('/')
            }
        } catch (error){
            console.log(error);
            toast.error(error.message);
            setLoading(false);
        }
    };
    const completeRegisterForm = () => ( <form onSubmit={handleSubmit} >
            <label>Email Address for Verification
                <input type='email' className='form-control' value={email} onChange={e => setEmail(e.target.value)} disabled />
            </label>
            <label>Password
                <input type='password' className='form-control' placeholder='Enter password' value={password} onChange={e => setPassword(e.target.value)} autoFocus />
            </label>
            <Button
                onClick={handleSubmit}
                type='primary'
                block
                shape='round'
                className='mb-3'
                size='large'
                disabled={password.length < 6}
                icon={<LikeOutlined />}>Complete Verification
            </Button>
        </form>
    );
    return (
        <div className='container p-5'>
            <div className="row">
                <div className='col-md-6 offset-md-3'>
                    { loading ? (<h4
                            className='text-danger'
                            style={{textAlign: 'center'}}>
                            <LoadingOutlined />  Verifying...
                        </h4>) :
                        (<h4
                            style={{textAlign: 'center'}}>User Verification
                        </h4>) }
                    <br/>
                    <hr/>
                    {completeRegisterForm()}
                </div>
            </div>
        </div>
    );
};
export default RegisterComplete;
