import React, { useState, useEffect } from 'react';
import './Settings.less';
import Logo from '../../assets/casmm_logo.png';
import { getAllUsers, updateEmail, updateUsername, updatePassword } from '../../Utils/requests';
import { message, Modal, Input, Button, Form } from 'antd';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import DeleteButton from './DeleteButton';
import { postUser, setUserSession } from '../../Utils/AuthRequests';

function handleMergeRequest() {
  // called after clicking merge - code here
  console.log("test4");
}

export default function Settings() {
  // to-do: need verification that user is not yet merged, change css of modals, verify current and new are not the same when submitting, connecting form to handle functions
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);


  const [password, setPassword] = useState("");

  const[newUsername, setNewUsername] = useState("");
  const[newPassword1, setNewPassword1] = useState("");
  const[newPassword2, setNewPassword2] = useState("");
  const[newEmail, setNewEmail] = useState("");

  const allUsers = getAllUsers();

  const showUserModal = () => {
    setIsUserModalOpen(true);
  };
  
  function handleUsernameChange(id, newUsername, password) {
    // called after clicking change username - code here
    updateUsername(id, newUsername).then((response) => {
      let body = { identifier: newUsername, password: password };
  
      postUser(body)
        .then((response) => {
          console.log(response.data.user);
          setUserSession(response.data.jwt, JSON.stringify(response.data.user));
          setUser(JSON.parse(sessionStorage.getItem('user')));
          message.success(`Username changed to ${newUsername}`);
          setPassword("");
        });
    });
  }

  const handleUserOk = () => {
    if (newUsername == "") {
      message.error("Please enter a username!");
      return;
    }
    else if (newUsername.length < 3) {
      message.error("Username is too short!");
    }
    else {
      let body = { identifier: user.username, password: password };
  
      postUser(body)
        .then((response) => {

          setUserSession(response.data.jwt, JSON.stringify(response.data.user));

          var goodUsername = true;
          getAllUsers().then((result) => {
            const users = result.data;
            
            for (var i = 0; i < users.length; i++) {
              if (users[i].username == newUsername) {
                message.error("That username is taken!");
                goodUsername = false;
              }
            }
    
            if (goodUsername == false) {
              return;
            }
            else {
              handleUsernameChange(user.id, newUsername, password);
              setIsUserModalOpen(false);
            }
          });
        
        }).catch((error) => {
          message.error('Incorrect Password');
        });
    }
    
  };
  
  const handleUserCancel = () => {
    setNewUsername("");
    setPassword("");
    setIsUserModalOpen(false);
  };

  const showPassModal = () => {
    setIsPassModalOpen(true);
  };

  function handlePasswordChange() {
    // called after clicking change password - code here
    updatePassword(user.id, newPassword1).then((response) => {
      let body = { identifier: user.username, password: newPassword1 };
  
      postUser(body)
        .then((response) => {
          console.log(response.data.user);
          setUserSession(response.data.jwt, JSON.stringify(response.data.user));
          setUser(JSON.parse(sessionStorage.getItem('user')));
          message.success(`Password changed`);
          setPassword("");
          setNewPassword1("");
          setNewPassword2("");
        }); 
    });
  }
  
  const handlePassOk = () => {
    if (newPassword1 == "") {
      message.error("Please enter a valid password");
      return;
    }
    else if (newPassword1.length < 6) {
      message.error("Password is too short.");
      return;
    }
    else if (newPassword1 != newPassword2) {
      message.error("Passwords do not match.");
      return;
    }
    else {
      handlePasswordChange();
      setIsPassModalOpen(false);
    }
  };
  
  const handlePassCancel = () => {
    setPassword("");
    setNewPassword1("");
    setNewPassword2("");
    setIsPassModalOpen(false);
  };

  const showEmailModal = () => {
    setIsEmailModalOpen(true);
  };

  function handleEmailChange(id, newEmail, password) {
    // called after clicking change email - code here
    updateEmail(id, newEmail).then((response) => {
      let body = { identifier: user.username, password: password };
  
      postUser(body)
        .then((response) => {
          console.log(response.data.user);
          setUserSession(response.data.jwt, JSON.stringify(response.data.user));
          setUser(JSON.parse(sessionStorage.getItem('user')));
          message.success(`Email changed to ${newEmail}`);
          setPassword("");
        });
    });
    
  }
  
  const handleEmailOk = () => {
    if (newEmail == "") {
      message.error("Please enter an email!");
      return;
    }
    else if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newEmail))) {
      message.error("Please enter a valid email.");
      return;
    }
    else {
      let body = { identifier: user.username, password: password };
  
      postUser(body)
        .then((response) => {

          setUserSession(response.data.jwt, JSON.stringify(response.data.user));

          var goodUsername = true;
          getAllUsers().then((result) => {
            const users = result.data;
            
            for (var i = 0; i < users.length; i++) {
              if (users[i].email == newEmail) {
                message.error("That email is already registered to an account!");
                goodUsername = false;
              }
            }
    
            if (goodUsername == false) {
              return;
            }
            else {
              handleEmailChange(user.id, newEmail, password);
              setIsEmailModalOpen(false);
            }
          });
        
        }).catch((error) => {
          message.error('Incorrect Password');
        });
    }
  };
  
  const handleEmailCancel = () => {
    setNewEmail("");
    setPassword("");
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
            <Input placeholder="Enter current password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="Enter your new username:" name="user" rules={[{ required: true }]}>
            <Input placeholder="Enter your new username"
              onChange={(e) => {
                setNewUsername(e.target.value);
              }}
            />
          </Form.Item>
        </Form>  
      </Modal>

      <Modal title="Change Password" open={isPassModalOpen} onOk={handlePassOk} onCancel={handlePassCancel} footer={[
         <Button key="back" onClick={handlePassCancel}>Cancel</Button>,
         <Button key="submit" onClick={handlePassOk} type="primary">Change Password</Button>
      ]} destroyOnClose={true}>
        <Form name="change-password" onFinish={handlePasswordChange} autoComplete="off">
          <Form.Item label="Enter your current password:" name="currentpassword" rules={[{ required: true }]}>
            <Input placeholder="Enter current password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
            />
          </Form.Item>
          <Form.Item label="Enter your new password:" name="password" rules={[{ required: true }]}>
            <Input placeholder="Enter your new password"
                onChange={(e) => {
                  setNewPassword1(e.target.value);
                }}
            />
          </Form.Item>
          <Form.Item label="Confirm your new password:" name="password2" 
            onChange={(e) => {
              setNewPassword2(e.target.value);
            }}
          dependencies={['password']} rules={[
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
         <Button key="submit" onClick={handleEmailOk} type="primary">Change Email</Button>
      ]} destroyOnClose={true}>
      <Form name="change-email" onFinish={handleEmailChange} autoComplete="off">
          <p>Current email: {user.email} </p>
          <Form.Item label="Enter your current password:" name="currentpassword" rules={[{ required: true }]}>
            <Input placeholder="Enter current password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="Enter your new email:" name="email" rules={[{ required: true }]}>
            <Input placeholder="Enter your new email"
              onChange={(e) => {
                setNewEmail(e.target.value);
              }}
            />
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
