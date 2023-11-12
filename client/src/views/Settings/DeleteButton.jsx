import React, { useState, useEffect } from 'react';
import './DeleteButton.less';
import './Settings.less';
import Logo from '../../assets/casmm_logo.png';
import { postUser, setUserSession } from '../../Utils/AuthRequests';
import { message } from 'antd';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import {Modal, Button} from 'antd';
import { deleteUser } from '../../Utils/requests.js'
import { removeUserSession } from '../../Utils/AuthRequests';

export default function DeleteButton() {
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  if (sessionStorage.getItem('user') != undefined) {
    const user = JSON.parse(sessionStorage.getItem('user')); // get user variable
  }

  useEffect(() => { // redirect if user is not logged in 
    if (sessionStorage.getItem('user') == undefined) {
      navigate('/teacherlogin');
    }
  }, []);

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
    
    // Check if correct password by logging in with postUser

    let body = { identifier: user.username, password: password };

    postUser(body)
    .then((response) => {
      setUserSession(response.data.jwt, JSON.stringify(response.data.user));
      message.success('Account successfully deleted.');

      // Delete user w/ calling deleteUser - function found in ../../Utils/requests.js, communicates with endpoints
      console.log(deleteUser(user.id));

      // Remove user session
      removeUserSession();

      // Redirect to root of website.
      navigate('/');
    })
    .catch((error) => {
      // User entered wrong password
      
      message.error('Incorrect password.');
    });
  }

  try {
  return (
    <>
          <button id='delete-account-button' onClick={showModal}>
              Delete Account
          </button>
          <Modal
              title={'Delete Account?'}
              visible={visible}
              onCancel={handleCancel}
              width='50vw'
              footer={''}
          >
              <div style={{justifyContent: "center"}}>Are you sure you want to delete your account?</div>
              <br></br>
              <div>All of your account's data will be lost and cannot be recovered.</div>
              <br></br>
              <div>Please enter your password to verify your identity.</div>
              <input
                type='password'
                placeholder={`Enter password for ${user.username}`}
                autoComplete='current-password'
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <br></br>
              <button id="delete-in-modal"
                onClick={handleDelete}
              >
                Delete!
              </button>
          </Modal>
          </>
  );
  }
  catch (e) {
    navigate('/teacherlogin');
  }
}
