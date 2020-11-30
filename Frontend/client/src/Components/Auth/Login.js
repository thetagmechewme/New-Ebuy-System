import React, {useState, useEffect} from 'react';
import {toast} from 'react-toastify';
import './style.css';
import {auth, fbAuthProvider, gitHubProvider, googleAuthProvider} from "../../firebase";
import { Button } from 'antd';
import {FacebookOutlined, GithubOutlined, GoogleOutlined, LoadingOutlined, MailOutlined} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {userConst} from "../../actions/constants";
import { Link } from 'react-router-dom';
import {userCreateUpdate} from "../../functions/auth.function";


const Login = ({history}) => {

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(state => ({...state}));

    useEffect(() => {
        let intended = history.location.state;
        if(intended){
            return ;
        } else{
            if(user && user.token) history.push('/');
        }

    },[user, history]);

    let dispatch = useDispatch();
    //Redirect User based on role
    const roleBasedRedirect = (res) => {
        //check if intended
        let intended = history.location.state;
        if(intended){
            history.push(intended.from);
        } else {
            if(res.data.role === 'Admin'){
                history.push('/admin/dashboard');
            } else{
                history.push('/user/history');
            }
        }
    };

    //Email Login Function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        // console.table(email, password);
        try{
            const result = await auth.signInWithEmailAndPassword(email, password)
            console.log('Result: ', result);
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
                    roleBasedRedirect(res);
                    toast.success(`Welcome ${res.data.role}!`);
                }))
                .catch();
            // toast.success(`${res.data.name} is successfully logged in! Enjoy our store`);
            //Redirect user to Home page
            // history.push('/');

        } catch (error){
            console.log('Error: ', error);
            toast.error(error.message);
            setLoading(false);
        }
    };

    //Google Login Function
    const googleAuthLogin = async () => {
        auth.signInWithPopup(googleAuthProvider)
            .then( async (result) => {
                const {user} = result
                const idTokenResult = await user.getIdTokenResult();
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
                        roleBasedRedirect(res);
                    }))
                    .catch(err => console.log(err));
                //Redirect user to Home page
                //history.push('/');
                toast.success('User is successfully logged in! Enjoy our store');
            })
            .catch(error => {
                console.log('Error: ', error);
                toast.error(error.message);
            })
    };
    //Facebook Login Function
    const fbAuthLogin = async () => {
        auth.signInWithPopup(fbAuthProvider)
            .then(async (result) => {
                const {user} = result
                const idTokenResult = await user.getIdTokenResult();
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
                        roleBasedRedirect(res);
                    }))
                    .catch(err => console.log(err));
                //Redirect user to Home page
                //history.push('/');
                toast.success('User is successfully logged in! Enjoy our E-buy store');
            })
            .catch(error => {
                console.log('Error: ', error);
                toast.error(error.message);
            })
    };
    //GitHub Auth Function
    const gitHubAuthLogin = () => {
        auth.signInWithPopup(gitHubProvider)
            .then(async (result) => {
                const {user} = result
                const idTokenResult = await user.getIdTokenResult();
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
                        roleBasedRedirect(res);
                    }))
                    .catch(err => console.log(err));
                //Redirect user to Home page
                //history.push('/');
                toast.success('User is successfully logged in! Enjoy our store');
            })
            .catch(error => {
                console.log('Error: ', error);
                toast.error(error.message);
            })
    };

    const loginForm = () => (
        <form onSubmit={handleSubmit} >
            <label>Email Address
                <input type='email' className='form-control' placeholder='Enter Email' value={email} onChange={e => setEmail(e.target.value)} autoFocus />
            </label>
            <label>Password
                <input type='password' className='form-control' placeholder='Enter password' value={password} onChange={e => setPassword(e.target.value)}/>
            </label>
            <Button
                onClick={handleSubmit}
                type='primary'
                block
                shape='round'
                className='mb-3'
                size='large'
                disabled={!email || password.length < 6}
                icon={<MailOutlined />}>Log in with Email/Password
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
                icon={<GoogleOutlined />}>Log In with Google
            </Button>
            <Button
                onClick={fbAuthLogin}
                style={{backgroundColor: '#3b5998', color: '#fff'}}
                block
                shape='round'
                className='mb-3'
                size='large'
                icon={<FacebookOutlined />}>Log In with Facebook
            </Button>
            <Button
                onClick={gitHubAuthLogin}
                style={{backgroundColor: '#212529', color: '#fff'}}
                block
                shape='round'
                className='mb-3'
                size='large'
                icon={<GithubOutlined />}>Log In with GitHub
            </Button>

            <Link to='/forgot_password' className='float-right  text-danger'>Forgot Password?</Link>
        </form>
    );
    return(
        <div className='container p-5'>
            <div className="row">
                <div className='col-md-6 offset-md-3'>
                    { loading ? (<h4
                        className='text-danger'
                        style={{textAlign: 'center'}}>
                        <LoadingOutlined />  Logging In...
                    </h4>) :
                        (<h4
                            style={{textAlign: 'center'}}>User Login
                        </h4>) }
                    <br/>
                    <hr/>
                    {loginForm()}
                </div>
            </div>
        </div>
    );
}
export default Login;
