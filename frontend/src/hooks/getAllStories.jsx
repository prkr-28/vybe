import React, {useEffect} from 'react';
import axios from 'axios';
import {serverUrl} from '../App';
import {useDispatch, useSelector} from 'react-redux';
import {setStoryList} from '../redux/storySlice';

export const useGetAllStories = () => {
   const dispatch = useDispatch();
   const {userData} = useSelector((state) => state.user);
   const {storyList} = useSelector((state) => state.story);

   useEffect(() => {
      const fetchAllStories = async () => {
         try {
            const response = await axios.get(`${serverUrl}/api/story/`, {
               withCredentials: true,
            });

            dispatch(setStoryList(response.data.stories)); // ✅ use only the array
         } catch (error) {
            console.error('Error fetching all stories:', error);
         }
      };

      fetchAllStories();
   }, [dispatch, userData]);
};
