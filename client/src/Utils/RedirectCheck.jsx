import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGlobalState } from './userState';

// ensures user is actually authorized to access to given page, prevent accessing pages through directly inserting URL or magically appearing
function RedirectCheck({ children, role, deleteattempt }) {
    const [value] = useGlobalState('currUser');
    // special case - personal student accounts can access student spaces, special case - student tries to delete their organizational made account
    if (deleteattempt === "true") {
        if (value.role === 'Student') {
            return <Navigate to='/student'/> 
        }
        else {
            return children;
        }
    }
    if (role != value.role && role === 'Student' && value.role === 'PersonalUser' || role == value.role) {
        return children;
    }
    else {
        if (value.role === 'ContentCreator') {
            return <Navigate to='/ccdashboard'/> 
        }
        else if (value.role === 'Mentor') {
            return <Navigate to='/dashboard'/> 
        }
        else if (value.role === 'Student') {
            return <Navigate to='/student'/> 
        }
        else if (value.role === 'Researcher') {
            return <Navigate to='/report'/> 
        }
        else if (value.role === 'PersonalUser') {
            return <Navigate to='/student'/>
        }
    }
  }
  
  export default RedirectCheck;