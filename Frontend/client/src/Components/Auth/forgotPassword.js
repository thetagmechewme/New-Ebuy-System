import React, { useState, useEffect } from 'react';
import {toast} from 'react-toastify';
import {auth} from "../../firebase";
import { useSelector } from 'react-redux';
//import {userConst} from "../../actions/constants";
import {LoadingOutlined, RetweetOutlined} from "@ant-design/icons";
import {Button} from "antd";

const ForgotPassword = ({history}) => {
   const [email, setEmail] = useState('');
   const [loading, setLoading] = useState(false);
   const {user} = useSelector(state => ({...state}));

   useEffect(() => {
       if(user && user.token) history.push('/');
   },[user, history]);

   const handleSubmit = async (e) => {
       e.preventDefault();
       setLoading(true);
       const config = {
           url: process.env.REACT_APP_FORGOT_PASSWORD_URL,
           handleCodeInApp: true,
       };

       await auth.sendPasswordResetEmail(email, config)
           .then(() => {
                setEmail('');
               setLoading(false);
               toast.success('Complete the reset password process through the link sent to the verified email');
           })
           .catch((error) => {
               setLoading(false);
               console.log('Error: ', error);
               toast.error(error.message);
           })
   };

   return (
       <div className='container col-md-6 offset=md-3 p-5' >
           { loading ? (<h4
                   className='text-danger'
                   style={{textAlign: 'center'}}>
                   <LoadingOutlined />  Sending Link...
               </h4>) :
               (<h4
                   style={{textAlign: 'center'}}>Forgot Password
               </h4>) }
           <form onSubmit={handleSubmit} >
               <label>Verified Email Address
                   <input type='email' className='form-control' placeholder='Enter a verified Email' value={email} onChange={e => setEmail(e.target.value)} autoFocus />
               </label>
               <Button
                   onClick={handleSubmit}
                   type='primary'
                   block
                   shape='round'
                   className='mb-3'
                   size='large'
                   disabled={!email}
                   icon={<RetweetOutlined />}>Reset Password
               </Button>
           </form>
       </div>
   );
};
export default ForgotPassword;
