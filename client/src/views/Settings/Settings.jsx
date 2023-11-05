import React, { useState, useEffect } from 'react';
import './Settings.less';
import Logo from '../../assets/casmm_logo.png';
import { getStudents, postJoin } from '../../Utils/requests';
import { setUserSession } from '../../Utils/AuthRequests';
import { message, Modal, Input, Button, Form } from 'antd';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import DeleteButton from './DeleteButton';


function handleUsernameChange() {
  // called after clicking change username - code here
  console.log("test");
}


function handleEmailChange() {
  // called after clicking change email - code here
  console.log("test2");
  
}

function handlePasswordChange() {
  // called after clicking change password - code here
  console.log("test3");
}

function handleMergeRequest() {
  // called after clicking merge - code here
  console.log("test4");
}

function handleDeletionNavigation() {
  // called after clicking delete account - code here
  
}

export default function Settings() {
  // to-do: need verification that user is not yet merged, change css of modals, verify current and new are not the same when submitting, connecting form to handle functions
  const navigate = useNavigate;
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);


  const showUserModal = () => {
    setIsUserModalOpen(true);
  };
  
  const handleUserOk = () => {
    handleUsernameChange();
    setIsUserModalOpen(false);
  };
  
  const handleUserCancel = () => {
    setIsUserModalOpen(false);
  };

  const showPassModal = () => {
    setIsPassModalOpen(true);
  };
  
  const handlePassOk = () => {
    handlePasswordChange();
    setIsPassModalOpen(false);
  };
  
  const handlePassCancel = () => {
    setIsPassModalOpen(false);
  };

  const showEmailModal = () => {
    setIsEmailModalOpen(true);
  };
  
  const handleEmailOk = () => {
    handleEmailChange();
    setIsEmailModalOpen(false);
  };
  
  const handleEmailCancel = () => {
    setIsEmailModalOpen(false);
  };

  const showMergeModal = () => {
    setIsMergeModalOpen(true);
  };
  
  const handleMergeOk = () => {
    handleMergeRequest();
    setIsMergeModalOpen(false);
  };
  
  const handleMergeCancel = () => {
    setIsMergeModalOpen(false);
  };

  return (
    <div className='container nav-padding'>
      <NavBar />      
      
      <Modal title="Change Username" open={isUserModalOpen} onOk={handleUserOk} onCancel={handleUserCancel} footer={[
         <Button key="back" onClick={handleUserCancel}>Cancel</Button>,
         <Button key="submit" onClick={handleUserOk} type="primary">Change Username</Button>
      ]} destroyOnClose={true}>
        <Form name="change-user" onFinish={handleUsernameChange} autoComplete="off">
          <p>Current username: {user.username} </p>
          <Form.Item label="Enter your current password:" name="currentpassword" rules={[{ required: true }]}>
            <Input placeholder="Enter current password"/>
          </Form.Item>
          <Form.Item label="Enter your new username:" name="user" rules={[{ required: true }]}>
            <Input placeholder="Enter your new username"/>
          </Form.Item>
          <Form.Item label="Confirm your new username:" name="user2" dependencies={['user']} rules={[
          {
            required: true,
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The new password that you entered do not match!'));
            },
          }),
        ]}> 
            <Input placeholder="Enter your new username"/>
          </Form.Item>
        </Form>  
      </Modal>

      <Modal title="Change Password" open={isPassModalOpen} onOk={handlePassOk} onCancel={handlePassCancel} footer={[
         <Button key="back" onClick={handlePassCancel}>Cancel</Button>,
         <Button key="submit" onClick={handlePassOk} type="primary">Change Password</Button>
      ]} destroyOnClose={true}>
        <Form name="change-password" onFinish={handlePasswordChange} autoComplete="off">
          <Form.Item label="Enter your current password:" name="currentpassword" rules={[{ required: true }]}>
            <Input placeholder="Enter current password"/>
          </Form.Item>
          <Form.Item label="Enter your new password:" name="password" rules={[{ required: true }]}>
            <Input placeholder="Enter your new password"/>
          </Form.Item>
          <Form.Item label="Confirm your new password:" name="password2" dependencies={['password']} rules={[
          {
            required: true,
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The new password that you entered do not match!'));
            },
          }),
        ]}> 
            <Input placeholder="Enter your new password"/>
          </Form.Item>
        </Form>  
      </Modal>

      <Modal title="Change Email" open={isEmailModalOpen} onOk={handleEmailOk} onCancel={handleEmailCancel} footer={[
         <Button key="back" onClick={handleEmailCancel}>Cancel</Button>,
         <Button key="submit" onClick={handleEmailChange} type="primary">Change Email</Button>
      ]} destroyOnClose={true}>
      <Form name="change-email" onFinish={handleEmailChange} autoComplete="off">
          <p>Current email: {user.email} </p>
          <Form.Item label="Enter your current password:" name="currentpassword" rules={[{ required: true }]}>
            <Input placeholder="Enter current password"/>
          </Form.Item>
          <Form.Item label="Enter your new email:" name="email" rules={[{ required: true }]}>
            <Input placeholder="Enter your new email"/>
          </Form.Item>
          <Form.Item label="Confirm your new email:" name="email2" dependencies={['email']} rules={[
          {
            required: true,
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The new password that you entered do not match!'));
            },
          }),
        ]}> 
            <Input placeholder="Enter your new email"/>
          </Form.Item>
        </Form>  
      </Modal>

      <Modal title="Merging Personal and Organizational Accounts" open={isMergeModalOpen} onOk={handleMergeOk} onCancel={handleMergeCancel} footer={[
         <Button key="redirect" onClick={handleMergeRequest} type="primary">Redirect to Login</Button>
      ]} destroyOnClose={true}>
       <p> To merge accounts, click the button below to be redirected to the login page. You will be prompted to login to the account you want to link. </p>
      </Modal>

      <div id='main-settings-header'>User Settings</div>
      <div id="settings-parent">
        <div id='settings-container'>
          <div id='settings-information-container'>
            <div id='settings-header'>General Settings</div>
            <div id='display-account-info'>
              Account Type: {user.role.name}
            </div>
            <div id='display-account-sensitive'>
            <p>Username: {user.username} </p>
            <p>Password: ************</p>
            </div>

            <div id='display-account-info' >
            Email Addresss: {user.email}
            </div>
            <div id='display-account-info' >
            Merge Organizational to Personal Account
            </div>
          </div>

            <div id='settings-button-container'>
              <button id="settings-button-1" onClick={showUserModal}>Change Username</button>
              <button id="settings-button-2" onClick={showPassModal}>Change Password</button>
              <button id="settings-button-3" onClick={showEmailModal}>Change Email</button>
              <button id="settings-button-4" onClick={showMergeModal}>Merge</button>
            </div>
            
          </div>

        <div id="settings-navi-bar">
          <button id="general-settings-button">General Settings</button>
          <DeleteButton />
        </div>
      </div>



    </div>
  );
}
