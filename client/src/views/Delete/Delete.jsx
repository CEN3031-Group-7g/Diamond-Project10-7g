import React, { useState, useEffect } from 'react';
import './Delete.less';
//import cautionImage from './caution.png'
import Logo from '../../assets/casmm_logo.png';
import { postUser, setUserSession } from '../../Utils/AuthRequests';
import { message } from 'antd';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import {Modal, Button} from 'antd';
import { deleteUser } from '../../Utils/requests.js'
import { removeUserSession } from '../../Utils/AuthRequests';

export default function Delete() {
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  if (sessionStorage.getItem('user') != undefined) {
    const user = JSON.parse(sessionStorage.getItem('user'));
  }

  useEffect(() => {
    if (sessionStorage.getItem('user') == undefined) {
      navigate('/teacherlogin');
    }
  }, []);


  // console.log(getMentor());

  const user = JSON.parse(sessionStorage.getItem('user'));

  const showModal = () => {
      setVisible(true)
  };

  const handleCancel = () => {
      setVisible(false)
  };

  const handleOk = () => {
      setVisible(false)
  };

  const handleDelete = () => {
    console.log(password);
    let body = { identifier: user.username, password: password };

    postUser(body)
    .then((response) => {
      setUserSession(response.data.jwt, JSON.stringify(response.data.user));
      message.success('Account successfully deleted.');
      console.log(deleteUser(user.id));
      removeUserSession();
      navigate('/');
    })
    .catch((error) => {
      message.error('Incorrect password.');
    });
  }
//Go back to dashboard
  const handleGoBack = () => {
      navigate('/dashboard');
  };

  try {
  return (
    <div className='container nav-padding'>
      <NavBar />
      <div id='delete-display-code-modal'>
      <button id='go-back-button' onClick={handleGoBack}>
          Dashboard
        </button>
        <button id='delete-display-code-btn' onClick={showModal}>
          <h1 id="number" style={{color: "white"}}>Delete Account</h1>
        </button>
        <Modal
          title={<div className="modal-title">Delete Account?</div>}
          visible={visible}
          onCancel={handleCancel}
          width='50vw'
          footer={[
            <div className="modal-footer-center">
            <button key="back" onClick={handleCancel} className="link-like-button">
              Cancel
            </button>
            </div>
            
          ]} 
        >
          {}
          <div className="modal-text-content">
            <p>Are you sure you want to delete your account?</p>
            <p>All of your account's data will be lost and cannot be recovered.</p>
            <p>Please enter your password to verify your identity.</p>
            <input
              type='password'
              placeholder={`Enter password for ${user.username}`}
              autoComplete='current-password'
              onChange={(e) => setPassword(e.target.value)}
            />
            <br></br>
            <button id="delete-in-modal" onClick={handleDelete}>Delete!</button>
          </div>
        </Modal>
      </div>
    </div>
  );
  }
  catch (e) {
    navigate('/teacherlogin');
  }
}
