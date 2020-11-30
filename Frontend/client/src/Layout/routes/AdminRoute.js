import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingRedirect from "./LoadingRedirect";
import { currentAdmin } from '../../functions/auth.function';

const AdminRoute = ({ children, ...rest }) => {
    const { user } = useSelector(state => ({...state}));
    const [ok, setOk] = useState(false);

    useEffect(() =>{
        if(user && user.token){
            currentAdmin(user.token)
                .then(res => {
                    console.log('Current Admin Response: ', res);
                    setOk(true);
                })
                .catch(err => {
                    console.log('Admin Res Error: ', err);
                    setOk(false);
                });
        }
    }, [user]);

    return ok ?
        <Route {...rest}  /> :
        <LoadingRedirect />;
};
export default AdminRoute;
