import React from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from './AuthRequests';
import PropTypes from 'prop-types';

// public route handler - if user is logged in already, don't let them access sign in pages
function PublicRoute({ children }) {
    const token = getToken();
    return token ? <Navigate to='/dashboard' /> : children;
}
PublicRoute.propTypes = {
    children: PropTypes.object,
}

  
export default PublicRoute;