import React, {useEffect} from 'react';
import axios from 'axios';
import {serverUrl} from '../App';
import {useDispatch, useSelector} from 'react-redux';
import {setFollowing, setUserData} from '../redux/userSlice';

const useGetCurrentUser = () => {
   const dispatch = useDispatch();
   const {storyData} = useSelector((state) => state.user);
   useEffect(() => {
      const fetchCurrentUser = async () => {
         try {
            const response = await axios.get(`${serverUrl}/api/user/current`, {
               withCredentials: true,
            });

            dispatch(setUserData(response.data));
            dispatch(setFollowing(response.data.following));
         } catch (error) {
            console.error('Error fetching current user:', error);
         }
      };

      fetchCurrentUser();
   }, [storyData, dispatch]);
};
export default useGetCurrentUser;
