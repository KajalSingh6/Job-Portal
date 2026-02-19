import store from '@/redux/store'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const UserProtectedRoute = ({ children }) => {

    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (!user || user.role !== "student") {
            navigate('/login');
        }
    }, [user, navigate]);
    return (
        <>
            {children}
        </>
    )
}

export default UserProtectedRoute;
