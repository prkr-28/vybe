import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import {serverUrl} from '../App';
import {useDispatch, useSelector} from 'react-redux';
import {setStoryData} from '../redux/storySlice';
import UserStoryViewCard from '../components/userStoryviewCard';

const Story = () => {
   const {userName} = useParams();
   const dispatch = useDispatch();
   const {storyData} = useSelector((state) => state.story);

   useEffect(() => {
      const fetchStories = async () => {
         try {
            const res = await axios.get(
               `${serverUrl}/api/story/user/${userName}`,
               {withCredentials: true}
            );
            dispatch(setStoryData(res.data.story));
         } catch (err) {
            console.error('Failed to fetch stories:', err);
         }
      };

      fetchStories();

      return () => dispatch(setStoryData([]));
   }, [userName, dispatch]);

   return (
      <div className="w-full h-screen bg-black flex justify-center items-center overflow-x-scroll">
         <UserStoryViewCard story={storyData} />
      </div>
   );
};

export default Story;
