import React, { useState, useEffect } from 'react';
import './SignUp.less';
import Logo from '../../assets/casmm_logo.png';
import { getStudents, postJoin } from '../../Utils/requests';
import { setUserSession } from '../../Utils/AuthRequests';
import { message } from 'antd';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import { updateRole, addUser, getAllUsers } from "../../Utils/requests"

export default function SignUp() {
    const [accountType, setAccountType] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    let dupUsername = false;
    let dupEmail = false;


    //used for dropdown menu
    /*
    const handleAccountTypeChange = (e) => {
        setAccountType(e.target.value);
    };
    */

    

    // Input Validation
    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return re.test(password);
    };

    const checkDuplicate = async (username, email) => {
        const res = await getAllUsers();
        if(res.data){
            const users = res.data;
            dupUsername = false;
            dupEmail = false;
            users.forEach((user) => {
                console.log(user.username + " " + user.email);
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

    const handlePasswordFocus = () => {
        setShowPasswordTooltip(true);
    };

    const handlePasswordBlur = () => {
        setShowPasswordTooltip(false);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleBackClick = () => {
        navigate('/teacherlogin');
    };

    const handleContinueClick = async () => {
        // Initially clear all error messages
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');

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

        // Validate confirm password
        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match.');
            isValid = false;
        }


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
            const res = await addUser(username, email, password);
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
                        <div id="signup-title">Create An Account: </div>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter new username" className="input-field" />
                        {usernameError && <div className="error-message">{usernameError}</div>}
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email address" className="input-field" />
                        {emailError && <div className="error-message">{emailError}</div>}
                        <input type="password" value={password} onChange={handlePasswordChange} onFocus={handlePasswordFocus} onBlur={handlePasswordBlur} placeholder="Enter new password" className="input-field" />
                        {showPasswordTooltip && (
                            <div className="password-tooltip">
                                Password must be at least 8 characters long and include at least one letter, one number, and one special character.
                            </div>
                        )}
                        {passwordError && <div className="error-message">{passwordError}</div>}
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="input-field" />
                        {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
                        <button type="button" onClick={handleContinueClick} className="action-button">Continue</button>
                        <button type="button" onClick={handleBackClick} className="action-button">Back</button>
                        <u id='request-admin' onClick={() => navigate('/AdminSignUp')}>
                            Requesting an administrator account?
                        </u>
                    </div>
                </div>
            </div>
            <SuccessModal />
        </div>
    );
}


//dropdown menu if needed later to choose b/w personal and org accounts
/*
                        <select
                            value={accountType}
                            onChange={handleAccountTypeChange}
                            className="input-field"
                        >
                            <option value="" disabled>Select Account Type</option>
                            <option value="Personal">Personal</option>
                            <option value="Organizational">Organizational</option>
                        </select>
*/