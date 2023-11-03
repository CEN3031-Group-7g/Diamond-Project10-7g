import React, { useState, useEffect } from 'react';
import './Delete.less';
import Logo from '../../assets/casmm_logo.png';
import { getStudents, postJoin } from '../../Utils/requests';
import { postUser, setUserSession } from '../../Utils/AuthRequests';
import { message } from 'antd';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import {Modal, Button} from 'antd';
import { useGlobalState } from '../../Utils/userState.js';

export default function Delete() {
  const [currUser] = useGlobalState('currUser');
  const role = currUser.role;
  const name = currUser.name;
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  var num = 0;

  useEffect(() => {
    navigate('/teacherlogin');
  }, [num]);

  if (sessionStorage.getItem('user') != undefined) {
    const user = JSON.parse(sessionStorage.getItem('user'));
  }
  else {
    num = num + 1;
    return (
      <>
      <div className='container nav-padding'>
        <NavBar />
        Please login first!
      </div>
      </>
    );
  }




  const user = JSON.parse(sessionStorage.getItem('user'));

  const showModal = () => {
      setVisible(true)
      console.log(user);
  };

  const handleCancel = () => {
      setVisible(false)
  };

  const handleOk = () => {
      setVisible(false)
  };


  return (
    <div className='container nav-padding'>
      <NavBar />
        Delete Page

        <div id='delete-display-code-modal'>
          <button id='delete-display-code-btn' onClick={showModal}>
              <h1 id="number" style={{color: "white"}}>Delete Account</h1>
          </button>
          <Modal
              title={'Delete Account?'}
              visible={visible}
              onCancel={handleCancel}
              width='50vw'
              footer={' '}
          >
              <div>Are you sure you want to delete your account?</div>
              <div>Please enter your password to verify your identity.</div>
              <div>{name}</div>
              <div>{user.username}</div>
              <input
                type='password'
                placeholder='Password'
                autoComplete='current-password'
              />
          </Modal>
        </div>
    </div>
  );
}
