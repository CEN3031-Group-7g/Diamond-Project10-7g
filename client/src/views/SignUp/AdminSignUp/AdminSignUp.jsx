import React, { useState } from 'react';
import './AdminSignUp.less';
import NavBar from '../../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import { addAdministratorAccountRequest, getAdminRequests } from '../../../Utils/requests';

export default function AdminSignUp() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [orgName, setOrgName] = useState('');
    const [orgError, setOrgError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
    let dupRequest = false;
    let alreadyApproved = false;
    let isValid = true;

    //input validation

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

    // check if administrator account request already exists
    // if in progress or already approved, do not let user request again
    // if already denied, allow user to resubmit another request
    // if request does not yet exist, allow user to submit request
    
    const checkAdminDuplicate = async (email) => {
        const res = await getAdminRequests();
        if(res.data){
            const adminRequestInfo = res.data;
            dupRequest = false;
            adminRequestInfo.forEach((entry) => {
                if (entry.Admin_email === email) {
                    if (entry.approval_status === 'awaiting_review') {
                        dupRequest = true;
                    }
                    if (entry.approval_status === 'approved') {
                        alreadyApproved = true;
                    }
                }
            })
        }
    }
    

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleOrgChange = (e) => {
        setOrgName(e.target.value);
    };

    const handleContinueClick = async () => {
        // Initially clear all error messages
        setEmailError('');
        setPasswordError('');

        isValid = true;

        // Validate email
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.');
            isValid = false;
        }

        // check if admin request is already approved/in progress
        await checkAdminDuplicate(email);
        if (dupRequest) {
            setEmailError('A request using this email is already in progress. Please wait for your request to be reviewed.');
            isValid = false;
        }
        if (alreadyApproved) {
            setEmailError('A request using this email has already been approved.');
            isValid = false;
        }

        // Validate password
        if (!validatePassword(password)) {
            setPasswordError('Password must be at least 8 characters long and include at least one letter, one number, and one special character.');
            isValid = false;
        }

        // Validate password
        if (!validateOrgName(orgName)) {
            setOrgError('Organization name required.');
            isValid = false;
        }

        // If email, username, password, and org name are valid, continue
        if (isValid) {
            const res = await addAdministratorAccountRequest(email);
            if (res.data) {
                const emailAddress = 'superadmin@mail.com';
                const subject = 'NEW Administrator Account Request';
                const body = 'Organization name: ' + orgName + '\nEmail: ' + email + '\nUsername: ' + username + '\nPassword: ' + password;

                const mailTo = 'mailto:' + emailAddress + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

                window.location.href = mailTo;
                setShowSuccessModal(true);
            }
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
                            <span className="warning">&#9888;</span>
                            <b>Almost done!</b>
                        </div>
                        <div className="finish-message">
                            <p>Send this email to complete your account request.</p>
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
