import React, { useState, useEffect } from 'react';
import './SignUp.less';
import Logo from '../../assets/casmm_logo.png';
import { getStudents, postJoin } from '../../Utils/requests';
import { setUserSession } from '../../Utils/AuthRequests';
import { message } from 'antd';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [accountType, setAccountType] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleButtonClick = (type) => {
        setAccountType(type);
    };

    const handleContinueClick = () => {
        // Implement the logic to handle the continue button click
    };

    return (
        <div className='container nav-padding'>
            <NavBar />
            Signup Page
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
                        {accountType === 'Personal' && (
                            <>
                                <div id="account-type-title">Account Type: Personal</div>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email address" className="input-field" />
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter new username" className="input-field" />
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" className="input-field" />
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="input-field" />
                                <button type="button" onClick={handleContinueClick}>Continue</button>
                            </>
                        )}
                        {accountType === 'Organizational' && (
                            <div id="account-type-title">Account Type: {accountType}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
