import React, { useState, useEffect } from 'react';
import './SignUp.less';
import Logo from '../../assets/casmm_logo.png';
import { getStudents, postJoin } from '../../Utils/requests';
import { setUserSession } from '../../Utils/AuthRequests';
import { message } from 'antd';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import { addPersonalUser, getPersonalUsers } from "../../Utils/requests"

export default function SignUp() {
    const [accountType, setAccountType] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    let dupUsername = false;
    let dupEmail = false;

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

    const checkDuplicate = async (username, email) => {
        const res = await getPersonalUsers();
        if(res.data){
            const personalUsers = res.data;
            dupUsername = false;
            dupEmail = false;
            personalUsers.forEach((user) => {
                if(user.username === username)
                    dupUsername = true;
                if(user.email === email)
                    dupEmail = true;
            })
        }
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleContinueClick = async () => {
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

        // Ensure no duplicate usernames
        await checkDuplicate(username, email);
        if(dupUsername){
            setUsernameError('Username already in use, please log in');
            isValid = false;
        }
        if(dupEmail){
            setEmailError('Email already in use, please log in');
            isValid = false;
        }

        // If both email, username, and password are valid, continue
        if (isValid) {
            // Add account to the database
            const res = await addPersonalUser(username, email, password);
            if(res.data)
                setShowSuccessModal(true);
        }
    };

    const SuccessModal = () => {
        return (
            <div className="modal" style={{ display: showSuccessModal ? 'block' : 'none' }}>
                <div className="modal-content">
                    <span className="close" onClick={() => {
                        setShowSuccessModal(false);
                        navigate('/teacherlogin');
                    }}>&times;</span>
                    <div className="modal-body">
                        <div className="success-message">
                            <span className="checkmark">&#10003;</span>
                            Account successfully created
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
                        {!accountType && (
                            <>
                                <div id="signup-title">Please select your account type</div>
                                <button type="button" onClick={() => handleButtonClick('Personal')}>Personal</button>
                                <button type="button" onClick={() => handleButtonClick('Organizational')}>Organizational</button>
                            </>
                        )}
                        {(accountType === 'Personal' || accountType === 'Organizational') && (
                            <>
                                <div id="account-type-title">Account Type: {accountType}</div>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter new username" className="input-field" />
                                {usernameError && <div className="error-message">{usernameError}</div>}
                                <input type="email" value={email} onChange={handleEmailChange} placeholder="Enter email address" className="input-field" />
                                {emailError && <div className="error-message">{emailError}</div>}
                                <input type="password" value={password} onChange={handlePasswordChange} placeholder="Enter new password" className="input-field" />
                                {passwordError && <div className="error-message">{passwordError}</div>}
                                <button type="button" onClick={handleContinueClick}>Continue</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <SuccessModal />
        </div>
    );
}
