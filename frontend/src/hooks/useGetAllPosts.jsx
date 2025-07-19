import React, {useEffect} from 'react';
import axios from 'axios';
import {serverUrl} from '../App';
import {useDispatch} from 'react-redux';
import {setPostData} from '../redux/postSlice';

const useGetAllPosts = () => {
   const dispatch = useDispatch();
   useEffect(() => {
      const fetchAllPosts = async () => {
         try {
            const response = await axios.get(`${serverUrl}/api/post/getAll`, {
               withCredentials: true,
            });

            dispatch(setPostData(response.data));
         } catch (error) {
            console.error('Error fetching all posts:', error);
         }
      };

      fetchAllPosts();
   }, []);
};
export default useGetAllPosts;
