import React, {useEffect, useState} from 'react';
import './style.css';
import {auth, fbAuthProvider, gitHubProvider, googleAuthProvider} from "../../firebase";
import {toast} from 'react-toastify';
import { Button } from 'antd';
import {FacebookOutlined, GithubOutlined, GoogleOutlined, LoadingOutlined, MailOutlined} from '@ant-design/icons';
import {userConst} from "../../actions/constants";
import {useDispatch, useSelector} from 'react-redux';
import {userCreateUpdate} from "../../functions/auth.function";

const Register = ({history}) => {

    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(state => ({...state}));
    let dispatch = useDispatch();

    useEffect(() => {
        if(user && user.token) history.push('/');
    },[user, history]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const config = {
            url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
            handleCodeInApp: true,
        };

        await auth.sendSignInLinkToEmail( email, config );
        toast.success(`Email Verification Link sent to ${email}. Click to complete registration process`);

        //Save User Email in local storage
        window.localStorage.setItem('firstName', fname);
        window.localStorage.setItem('lastName', lname);
        window.localStorage.setItem('registrationEmail', email);
        //Clear
        setFname('');
        setLname('');
        setEmail('');
    };
    const googleAuthLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        auth.signInWithPopup(googleAuthProvider)
            .then(async (result) => {
                const {user} = result
                const idTokenResult = await user.getIdTokenResult()
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
                //Redirect user to Home page
                history.push('/');
                toast.success('User is successfully logged in! Enjoy our store');
            })
            .catch(error => {
                console.log('Error: ', error);
                toast.error(error.message);
                setLoading(false)
            })
    };

    //Facebook Login Function
    const fbAuthLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        auth.signInWithPopup(fbAuthProvider)
            .then(async (result) => {
                const {user} = result
                const idTokenResult = await user.getIdTokenResult()
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
                //Redirect user to Home page
                history.push('/');
                toast.success('User is successfully logged in! Enjoy our store');
            })
            .catch(error => {
                console.log('Error: ', error);
                toast.error(error.message);
                setLoading(false)
            })
    };
    //GitHub Auth Function
    const gitHubAuthLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        auth.signInWithPopup(gitHubProvider)
            .then(async (result) => {
                const {user} = result
                const idTokenResult = await user.getIdTokenResult()
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
                //Redirect user to Home page
                history.push('/');
                toast.success('User is successfully logged in! Enjoy our store');
            })
            .catch(error => {
                console.log('Error: ', error);
                toast.error(error.message);
                setLoading(false)
            })
    };

    const registerForm = () => ( <form onSubmit={handleSubmit} >
        <label>First Name
            <input type='text' className='form-control' placeholder='Enter First Name' value={fname} onChange={e => setFname(e.target.value)} autoFocus />
        </label>
        <label>Last Name
            <input type='text' className='form-control' placeholder='Enter Last Name' value={lname} onChange={e => setLname(e.target.value)} />
        </label>
        <label>Email Address
            <input type='email' className='form-control' placeholder='Enter Email' value={email} onChange={e => setEmail(e.target.value)} />
            <small>Passwordless authentication: A password will be required for the final step of verification.</small>
        </label>

            <Button
                onClick={handleSubmit}
                type='primary submit'
                block
                shape='round'
                className='mb-3'
                size='large'
                disabled={ !fname || !lname || !email}
                icon={<MailOutlined />}>Register with Email
            </Button>
            <div className="separator">Or</div>
            <br/>
            <Button
                onClick={googleAuthLogin}
                type='danger'
                block
                shape='round'
                className='mb-3'
                size='large'
                icon={<GoogleOutlined />}>Register with Google
            </Button>
            <Button
                onClick={fbAuthLogin}
                style={{backgroundColor: '#3b5998', color: '#fff'}}
                block
                shape='round'
                className='mb-3'
                size='large'
                icon={<FacebookOutlined />}>Register with Facebook
            </Button>
            <Button
                onClick={gitHubAuthLogin}
                style={{backgroundColor: '#212529', color: '#fff'}}
                block
                shape='round'
                className='mb-3'
                size='large'
                icon={<GithubOutlined />}>Register with GitHub
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
                            <LoadingOutlined /> Registering...
                        </h4>) :
                        (<h4
                            style={{textAlign: 'center'}}> User Registration
                        </h4>) }
                    <br/>
                    <hr/>
                    {registerForm()}
                </div>
            </div>
        </div>
    );
};
export default Register;
