import React, {useEffect} from 'react';
import axios from 'axios';
import {serverUrl} from '../App';
import {setSuggestedUsers} from '../redux/userSlice';
import {useDispatch, useSelector} from 'react-redux';

const useGetSuggestedUsers = () => {
   const dispatch = useDispatch();
   const {userData} = useSelector((state) => state.user);
   useEffect(() => {
      const fetchUsers = async () => {
         try {
            const response = await axios.get(
               `${serverUrl}/api/user/suggestedUsers`,
               {
                  withCredentials: true,
               }
            );
            dispatch(setSuggestedUsers(response.data));
         } catch (error) {
            console.error('Error fetching suggested users:', error);
         }
      };
      fetchUsers();
   }, [userData]);
};

export default useGetSuggestedUsers;
