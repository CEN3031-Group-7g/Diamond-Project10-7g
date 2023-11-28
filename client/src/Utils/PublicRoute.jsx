import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from './AuthRequests';
import { message } from 'antd';

// public route handler - if user is logged in already, don't let them access sign in pages
function PublicRoute({ children }) {
    const token = getToken();
    return token ? <Navigate to='/dashboard' /> : children;
}

  
export default PublicRoute;