import React, { useState, useEffect } from 'react';
import './Delete.less';
import Logo from '../../assets/casmm_logo.png';
import { getStudents, postJoin } from '../../Utils/requests';
import { setUserSession } from '../../Utils/AuthRequests';
import { message } from 'antd';
import NavBar from '../../components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';

export default function Delete() {

  return (
    <div className='container nav-padding'>
      <NavBar />
        Delete Page
    </div>
  );
}
