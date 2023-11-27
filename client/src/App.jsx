import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
import RedirectCheck from './Utils/RedirectCheck';
import About from './views/About/About';
import BlocklyPage from './views/BlocklyPage/BlocklyPage';
import BugReport from './views/BugReport/BugReport';
import ContentCreator from './views/ContentCreator/ContentCreator';
import Home from './views/Home/Home';
import Classroom from './views/Mentor/Classroom/Classroom';
import Dashboard from './views/Mentor/Dashboard/Dashboard';
import NotFound from './views/NotFound';
import Replay from './views/Replay/Replay';
import ActivityLevelReport from './views/Researcher/ActivityLevelReport';
import ActivityLevelReportView from './views/Researcher/ActivityLevelReportView';
import GroupReport from './views/Researcher/GroupReport';
import Report from './views/Researcher/Report';
import Student from './views/Student/Student';
import StudentLogin from './views/StudentLogin/StudentLogin';
import ForgetPassword from './views/TeacherLogin/ForgetPassword';
import ResetPassword from './views/TeacherLogin/ResetPassword';
import TeacherLogin from './views/TeacherLogin/TeacherLogin';
import SignUp from './views/SignUp/SignUp'
import AdminSignUp from './views/SignUp/AdminSignUp/AdminSignUp'
import Settings from './views/Settings/Settings'
import Delete from './views/Delete/Delete'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<PublicRoute><Home /></PublicRoute>} />
        <Route path='/about' element={<About />} />
        <Route path='/teacherlogin' element={<PublicRoute><TeacherLogin /></PublicRoute>} />
        <Route path='/forgot-password' element={<ForgetPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/login' element={<PublicRoute><StudentLogin /></PublicRoute>} />
        <Route path='/replay/:saveID' element={<Replay />} />
        <Route path='/sandbox' element={<BlocklyPage isSandbox={true} />} />
        <Route path='/signup' element={<PublicRoute><SignUp /></PublicRoute>} />
        <Route path='/adminsignup' element={<PublicRoute><AdminSignUp /></PublicRoute>} />
        <Route
          path='/report'
          element={
              <PrivateRoute>
                <RedirectCheck role="Researcher">
                  <Report />
                </RedirectCheck>
              </PrivateRoute>
          }
        />
        <Route
          path='/activityLevel'
          element={
            <PrivateRoute>
              <RedirectCheck role="Researcher">
                <ActivityLevelReport />
              </RedirectCheck>
            </PrivateRoute>
          }
        />
        <Route
          path='/settings'
          element = {
            <PrivateRoute>
              <RedirectCheck deleteattempt="true">
                <Settings />
              </RedirectCheck>
            </PrivateRoute>
          }
        />
        <Route
          path='/delete'
          element = {
            <PrivateRoute>
              <RedirectCheck deleteattempt="true">
                <Delete />
              </RedirectCheck>
            </PrivateRoute>
          }
        />
        <Route
          path='/activityLevel/:id'
          element={
            <PrivateRoute>
              <RedirectCheck role="Researcher">
                <ActivityLevelReportView />
              </RedirectCheck>
            </PrivateRoute>
          }
        />
        <Route
          path='/group-report'
          element={
            <PrivateRoute>
              <RedirectCheck role="Researcher">
                <GroupReport />
              </RedirectCheck>
            </PrivateRoute>
          }
        />
        <Route
          path='/dashboard'
          element={     
            <PrivateRoute>
              <RedirectCheck role="Mentor">
                <Dashboard />
              </RedirectCheck>
            </PrivateRoute>
          }
        />
        <Route
          path='/student'
          element={
            <PrivateRoute>
              <RedirectCheck role="Student">
                <Student />
              </RedirectCheck>
            </PrivateRoute>
          }
        />
        <Route
          path='/classroom/:id'
          element={
            <PrivateRoute>
              <RedirectCheck role="Mentor">
                <Classroom />
              </RedirectCheck>
            </PrivateRoute>
          }
        />
        <Route
          path='/workspace'
          element={
            <PrivateRoute>
              <RedirectCheck role="Student">
                <BlocklyPage isSandbox={false} />
              </RedirectCheck>
            </PrivateRoute>
          }
        />
        <Route
          path='/activity'
          element={
            <PrivateRoute>
              <RedirectCheck role="Student">
                <BlocklyPage isSandbox={false} />
              </RedirectCheck>
            </PrivateRoute>
          }
        />
        <Route
          path='/ccdashboard'
          element={
            <PrivateRoute>
              <RedirectCheck role="ContentCreator">
                <ContentCreator />
              </RedirectCheck>
            </PrivateRoute>
          }
        />
        <Route path='/bugreport' element={<BugReport />} />
        <Route path='*' element={<NotFound/>} />
      </Routes>
    </div>
  );
};

export default App;
