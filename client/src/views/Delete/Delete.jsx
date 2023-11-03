import React, { useState, useEffect } from 'react';
import './Delete.less';
import Logo from '../../assets/casmm_logo.png';
import { getStudents, postJoin } from '../../Utils/requests';
import { setUserSession } from '../../Utils/AuthRequests';
import { message } from 'antd';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import {Modal, Button} from 'antd';

export default function Delete() {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
      setVisible(true)
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

        <div id='dashboard-display-code-modal'>
          <button id='dashboard-display-code-btn' onClick={showModal}>
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
