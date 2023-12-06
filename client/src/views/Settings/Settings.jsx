import React, { useState, useEffect } from 'react';
import './Settings.less';
import { getAllUsers, updateEmail, updateUsername, updatePassword, getAllStudents, mergeAccounts, getAllMergedAccounts, deleteMerge } from '../../Utils/requests';
import { message, Modal, Input, Button, Form } from 'antd';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import DeleteButton from './DeleteButton';
import { postUser, setUserSession } from '../../Utils/AuthRequests';
import { useGlobalState } from '../../Utils/userState';
import Select from 'react-select'


export default function Settings() {
  const [value] = useGlobalState('currUser');
  const [isPersonalAccount, setIsPersonalAccount] = useState(false);

  useEffect(() => {
    if (value.role === "Personal") {
      setIsPersonalAccount(true);
    }
  }, []);
  

  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isUnMergeModalOpen, setIsUnMergeModalOpen] = useState(false);


  const [password, setPassword] = useState(""); // Holds user's input of password before updating anything.

  const[newUsername, setNewUsername] = useState(""); // Holds user's input of new username
  const[newPassword1, setNewPassword1] = useState(""); // Holds user's input of new password
  const[newPassword2, setNewPassword2] = useState(""); // Holds user's input of new password for confirming new password
  const[newEmail, setNewEmail] = useState(""); // Holds user's input of new email
  const[allStudents, setAllStudents] = useState("") // Holds all students from db for merge feature
  const[studentToMerge, setStudentToMerge] = useState("") // Holds student user wants to merge with in dropdown
  const[userIsMerged, setUserIsMerged] = useState(false); // Holds boolean if user is merged or not
  const[mergedWith, setMergedWith] = useState("") // Holds name of student who user is merged with
  const[emojiList, setEmojiList] = useState("") // Holds all emojis of students in the dropdown
  const[selectedEmoji, setSelectedEmoji] = useState(""); // Holds the selected emoji

  const allUsers = getAllUsers();

  useEffect(()=>{ // Get if user is merged
    getAllMergedAccounts().then((response) => {
      for (let i of response.data) {
        if (user.username == i.username) {
          // Set merged state variables.
          setUserIsMerged(true);
          setMergedWith(i.student);
        }
      }
    });
    getAllStudents().then((response) => {
        const obj = [];
        for (let i of response.data) {
          obj.push({value: i.character, label: i.character});
        }
        setEmojiList(obj);
    });
  }, []) 



  const showUserModal = () => {
    // Opens modal for change username button
    setIsUserModalOpen(true);
  };
  
  function handleUsernameChange(id, newUsername, password) {
    // called after clicking change username

    // call updateUsername with id and newUsername - function found in ../../Utils/requests.js, communicates with endpoints
    updateUsername(id, newUsername).then((response) => {
      let body = { identifier: newUsername, password: password };
  
      // login user with new username
      postUser(body)
        .then((response) => {

          // Set session variable
          setUserSession(response.data.jwt, JSON.stringify(response.data.user)); 

          // Get user info
          setUser(JSON.parse(sessionStorage.getItem('user')));
          
          // Show success message
          message.success(`Username changed to ${newUsername}`); 

          // Clear password state
          setPassword("");
        });
    });
  }

  const handleUserOk = () => {
    // Called when user presses Change Username on modal

    if (newUsername == "") {
      // No username entered!
      message.error("Please enter a username!");
      return;
    }
    else if (newUsername.length < 3) {
      // Username is too short
      message.error("Username is too short!");
    }
    else {
      // Check if correct password by logging in

      let body = { identifier: user.username, password: password };
  
      postUser(body)
        .then((response) => {

          setUserSession(response.data.jwt, JSON.stringify(response.data.user));

          // Compare username to all users in database: 

          var goodUsername = true;
          getAllUsers().then((result) => { // Gets all usernames in db
            const users = result.data;
            
            for (let i of users) {
              if (i.username == newUsername) { // Loop through username to find a match
                message.error("That username is taken!");
                goodUsername = false;
              }
            }
    
            if (goodUsername == false) {
              // Do not update username, duplicate username.

              return;
            }
            else {
              // Unique username, call handleUsernameChange and close modal

              handleUsernameChange(user.id, newUsername, password);
              setIsUserModalOpen(false);
            }
          });
        
        }).catch((error) => {
          // User entered wrong password

          message.error('Incorrect Password');
        });
    }
    
  };
  
  const handleUserCancel = () => {
    // Clears state variables and closes modal.

    setNewUsername("");
    setPassword("");
    setIsUserModalOpen(false);
  };

  const showPassModal = () => {
    // Opens password modal.

    setIsPassModalOpen(true);
  };

  function handlePasswordChange() {
    // called after clicking change password

    // Call updatePassword - defined in ../../Utils/requests.js, connects to backend.
    updatePassword(user.id, newPassword1).then((response) => {
      // Login user with new password

      let body = { identifier: user.username, password: newPassword1 };
  
      postUser(body)
        .then((response) => {
          setUserSession(response.data.jwt, JSON.stringify(response.data.user)); // Update session
          setUser(JSON.parse(sessionStorage.getItem('user'))); // Get user session to update screen
          message.success(`Password changed`); // Show success

          // Clear variables
          setPassword("");
          setNewPassword1("");
          setNewPassword2("");
        }); 
    });
  }
  
  const handlePassOk = () => {
    // Called when user presses change password.

    if (newPassword1 == "") { // Empty password
      message.error("Please enter a valid password");
      return;
    }
    else if (newPassword1.length < 6) { // Password too short
      message.error("Password is too short.");
      return;
    }
    else if (newPassword1 != newPassword2) { // New passwords do not match
      message.error("Passwords do not match.");
      return;
    }
    else {
      // Call next function and close modal

      handlePasswordChange();
      setIsPassModalOpen(false);
    }
  };
  
  const handlePassCancel = () => {
    // User cancels out of change password modal
    // Clear state and close modal.

    setPassword("");
    setNewPassword1("");
    setNewPassword2("");
    setIsPassModalOpen(false);
  };

  const showEmailModal = () => {
    // User presses change email button, show modal

    setIsEmailModalOpen(true);
  };

  function handleEmailChange(id, newEmail, password) {
    // called after clicking change email

    // Call updateEmail - defined in ../../Utils/requests.js, connects to backend. 
    updateEmail(id, newEmail).then((response) => {

      // login user with new email

      let body = { identifier: user.username, password: password };
  
      postUser(body)
        .then((response) => {
          setUserSession(response.data.jwt, JSON.stringify(response.data.user)); // Update session
          setUser(JSON.parse(sessionStorage.getItem('user'))); // Update user state to show new email on screen
          message.success(`Email changed to ${newEmail}`); // Show sucess message
          setPassword(""); // Clear password state.
        });
    });
    
  }
  
  const handleEmailOk = () => {
    // Called when user tries to change their email after filling out modal.

    if (newEmail == "") { // No email entered
      message.error("Please enter an email!");
      return;
    }
    else if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newEmail))) { // Regex to make sure new email is valid.
      message.error("Please enter a valid email.");
      return;
    }
    else {

      // Check correct password by logging user in with password entered

      let body = { identifier: user.username, password: password };
  
      postUser(body)
        .then((response) => {

          setUserSession(response.data.jwt, JSON.stringify(response.data.user));
          
          // Check if email is not taken by getting all users and comparing new email to all user's email

          let goodUsername = true;

          getAllUsers().then((result) => {
            const users = result.data;
            
            for (let i of users) {
              if (i.email == newEmail) {
                message.error("That email is already registered to an account!");
                goodUsername = false;
              }
            }
    
            if (goodUsername == false) {
              return;
            }
            else {
              // Call next function, close modal

              handleEmailChange(user.id, newEmail, password);
              setIsEmailModalOpen(false);
            }
          });
        
        }).catch((error) => {
          // user entered incorrect password

          message.error('Incorrect Password');
        });
    }
  };
  
  const handleEmailCancel = () => {
    // Called when user cancels out of change email modal
    // Clear email and password state and close modal

    setNewEmail("");
    setPassword("");
    setIsEmailModalOpen(false);
  };

  function handleMergeRequest() {
    // called after clicking merge - code here



    // Make call to merge request
    let studentId = '';
    studentId += studentToMerge.value.id;
    mergeAccounts(user.username, studentToMerge.value.name, studentId, studentToMerge.value.classroom).then((result) => {
      message.success("Successfully merged " + user.username + " to " + studentToMerge.value.name + "!");
      setUserIsMerged(true);
      setMergedWith(studentToMerge.value.name)
      setStudentToMerge("");
    });

  }

  const showMergeModal = () => {
    // click merge button

    // Get all students for dropdown
    getAllStudents().then((result) => {
      const allNames = [];

      for (let i of result.data) { // populate allNames with response

        let name = i.name;
        name += " | ";
        name += i.classroom.name;

        let value = {id: i.id, name: i.name, classroom: i.classroom.name}
        let obj = {value: value, label: name};
        allNames.push(obj);
      }

      // Sort names in alphabetical order
      allNames.sort((a, b) => a.label > b.label ? 1 : -1);

      // Set all students vector
      setAllStudents(allNames);

    });

    setIsMergeModalOpen(true); // Open modal
  };
  
  const handleMergeOk = () => {
    // Called when user presses merge accounts button


    // Make sure that the user has selected something
    if (studentToMerge == "") { // if didnt select anything, display error message
      message.error("Please select an account to merge with!");
      return;
    }
    if (selectedEmoji == "") {
      message.error("Please select an emoji!");
      return;
    }

    let correctEmoji = false;
    getAllStudents().then((result) => {
      for(let i of result.data) { // Check emoji against student

        if (i.name == studentToMerge.value.name) { // Emojis have to match
          if (selectedEmoji.label == i.character) {
            correctEmoji = true;
          }
          else {
            message.error("Emoji does not match the student!");
            correctEmoji = false;
          }
        }
      }

      if (correctEmoji) { // Corect emoji selected
        handleMergeRequest(); // Merge
        setIsMergeModalOpen(false); // Close modal
      }
  
      
    });


  };
  
  const handleMergeCancel = () => {
    // close merge modal
    
    setStudentToMerge("") // Clear selected student state
    setSelectedEmoji("") // Clear selected emoji

    setIsMergeModalOpen(false);
  };

  const handleSelectedStudentChange = (selectedOption) => {
    // Called when user selects a student from the dropdown

    setStudentToMerge(selectedOption); // Update who the selected student is

  };

  const handleSelectedEmojiChange = (selectedOption) => {
    setSelectedEmoji(selectedOption);
  }

  const showUnMergeModal = () => {
    setIsUnMergeModalOpen(true);

  }

  const handleUnMergeOk = () => {
    getAllMergedAccounts().then((response) => {
      for (let i of response.data) {
        if (user.username == i.username) {
          deleteMerge(i.id).then((response) => {
            message.success("Accounts successfully unlinked");
            setUserIsMerged(false);
            setMergedWith("");
            setIsUnMergeModalOpen(false);
          })
        }
      }
    });

  }

  const handleUnMergeCancel = () => {
    setIsUnMergeModalOpen(false);
  }

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
         <Button key="redirect" onClick={handleMergeOk} type="primary">Merge Accounts</Button>
      ]} destroyOnClose={true}>
       <p> To merge your account to a student account, please first select the student account you want to be merged to from the dropdown. </p>
       <p>Once your account is merged with a student account, they will be linked in the database! </p>
       <Select options={allStudents} onChange={handleSelectedStudentChange} />
       <br></br>
       <p>Select the student's associated emoji</p>
       <Select options={emojiList} onChange={handleSelectedEmojiChange}/>
      </Modal>

      <Modal title="Unmerge Account" open={isUnMergeModalOpen} onOk={handleUnMergeOk} onCancel={handleUnMergeCancel} footer={[
        <Button key="redirect" onClick={handleUnMergeOk} type="primary">Unmerge Accounts</Button>
      ]} destroyOnClose={true}>
        <p>You are about to unmerge your account from the student account.</p>
        <p>Please press the Unmerge Accounts button to continue.</p>
      </Modal>

      <div id='main-settings-header'>User Settings</div>
      <div id="settings-parent">
        <div id='settings-container'>
          <div id='settings-information-container'>
            <div id='settings-header'>General Settings</div>
            <div id='display-account-info'>
              Account Type:  {value.role}
            </div>
            <div id='display-account-sensitive'>
            <p>Username: {user.username} </p>
            <p>Password: ************</p>
            </div>

            <div id='display-account-info' >
            Email Addresss: {user.email}
            </div>
            <div id='display-account-info' >
              {isPersonalAccount ? "Merge Organizational to Personal Account" : null}
            </div>
          </div>

            <div id='settings-button-container'>
              <button id="settings-button-1" onClick={showUserModal}>Change Username</button>
              <button id="settings-button-2" onClick={showPassModal}>Change Password</button>
              <button id="settings-button-3" onClick={showEmailModal}>Change Email</button>
              {isPersonalAccount ? (
                userIsMerged ? (
                  <div id="settings-alreadyMerged" role="button" onClick={showUnMergeModal} onKeyDown={showUnMergeModal}>
                    Account merged with {mergedWith}
                  </div>
                ) : (
                  <button id="settings-button-4" onClick={showMergeModal}>
                    Merge
                  </button>
                )
              ) : null}
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
