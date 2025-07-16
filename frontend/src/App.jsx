import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Signup from './pages/signup';
import Signin from './pages/signin';
import ForgotPassword from './pages/forgotpassword';
import Home from './pages/home';
export const serverUrl = 'http://localhost:8000';
import {useSelector} from 'react-redux';
import useGetCurrentUser from './hooks/getCurrentUser';
import useGetSuggestedUsers from './hooks/getSuggestedUsers';

const App = () => {
   useGetCurrentUser();
   useGetSuggestedUsers();
   const {userData} = useSelector((state) => state.user);
   return (
      <Routes>
         <Route
            path="/signup"
            element={!userData ? <Signup /> : <Navigate to="/" />}
         />
         <Route
            path="/signin"
            element={!userData ? <Signin /> : <Navigate to="/" />}
         />
         <Route
            path="/forgotpassword"
            element={!userData ? <ForgotPassword /> : <Navigate to="/" />}
         />
         <Route
            path="/"
            element={userData ? <Home /> : <Navigate to="/signin" />}
         />
         {/* Add more routes as needed */}
      </Routes>
   );
};

export default App;
