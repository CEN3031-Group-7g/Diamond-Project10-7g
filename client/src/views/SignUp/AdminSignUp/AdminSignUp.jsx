import React, { useState, useEffect } from 'react';
import './AdminSignUp.less';
import Logo from '../../../assets/casmm_logo.png';
import { getStudents, postJoin } from '../../../Utils/requests';
import { setUserSession } from '../../../Utils/AuthRequests';
import { message } from 'antd';
import NavBar from '../../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';

export default function AdminSignUp() {
    const [accountType, setAccountType] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [orgName, setOrgName] = useState('');
    const [orgError, setOrgError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    const handleButtonClick = (type) => {
        setAccountType(type);
    };

    //input validation (still needs to incorporate back-end database for complete input validation ex: username/email already exists)

    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return re.test(password);
    };

    const validateOrgName = (orgName) => {
        const re = /\S/;
        return re.test(orgName);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleOrgChange = (e) => {
        setOrgName(e.target.value);
    };

    const handleContinueClick = () => {
        // Initially clear all error messages
        setEmailError('');
        setPasswordError('');

        let isValid = true;

        // Validate email
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            isValid = false;
        }

        // Validate password
        if (!validatePassword(password)) {
            setPasswordError('Password must be at least 8 characters long and include at least one letter, one number, and one special character.');
            isValid = false;
        }

        /*
        Validate username
        if(!validateUsername(username)){
            setUsernameError('Username already exists');
            isValid = false;
        }
        */

        // Validate password
        if (!validateOrgName(orgName)) {
            setOrgError('Organization name required.');
            isValid = false;
        }

        // If email, username, password, and org name are valid, continue
        if (isValid) {
            //...
            setShowSuccessModal(true);
        }
    };

    const SuccessModal = () => {
        return (
            <div className="modal" style={{ display: showSuccessModal ? 'block' : 'none' }}>
                <div className="modal-content">
                    <span className="close" onClick={() => {
                        setShowSuccessModal(false);
                        navigate('/');
                    }}>&times;</span>
                    <div className="modal-body">
                        <div className="success-message">
                            <span className="checkmark">&#10003;</span>
                            Administrator account requested.
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className='container nav-padding'>
            <NavBar />
            <div className="container">
                <div id="content-wrapper">
                    <div id="signup-box">
                        <div id="admin-request-title">Administrator Account Request</div>
                        <input type="org-name" value={orgName} onChange={handleOrgChange} placeholder="Enter organization name" className="input-field" />
                        {orgError && <div className="error-message">{orgError}</div>}
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter new username" className="input-field" />
                        <input type="email" value={email} onChange={handleEmailChange} placeholder="Enter email address" className="input-field" />
                        {emailError && <div className="error-message">{emailError}</div>}
                        <input type="password" value={password} onChange={handlePasswordChange} placeholder="Enter new password" className="input-field" />
                        {passwordError && <div className="error-message">{passwordError}</div>}
                        <button type="button" onClick={handleContinueClick}>Submit Request</button>
                    </div>
                </div>
            </div>
            <SuccessModal />
        </div>
    );
}
