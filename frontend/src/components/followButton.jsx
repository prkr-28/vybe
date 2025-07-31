import axios from 'axios';
import React from 'react';
import {useSelector} from 'react-redux';
import {serverUrl} from '../App';
import {useDispatch} from 'react-redux';
import {setFollowing, setUserData, toggleFollow} from '../redux/userSlice';

const FollowUser = ({targetUserId, tailwind}) => {
   const {following} = useSelector((state) => state.user);
   const isFollowing = following.some((user) => user._id === targetUserId);

   const dispatch = useDispatch();

   const handleFollowToggle = async () => {
      try {
         await axios.post(
            `${serverUrl}/api/user/follow/${targetUserId}`,
            {targetUserId},
            {withCredentials: true}
         );
         dispatch(toggleFollow(targetUserId)); // instant UI feedback

         setTimeout(async () => {
            const res = await axios.get(`${serverUrl}/api/user/current`, {
               withCredentials: true,
            });
            dispatch(setUserData(res.data));
            dispatch(setFollowing(res.data.following));
         }, 200);
      } catch (error) {
         console.error('Error toggling follow status:', error);
         alert('Failed to toggle follow status');
      }
   };

   return (
      <div>
         <button onClick={handleFollowToggle} className={`${tailwind}`}>
            {isFollowing ? 'Unfollow' : 'Follow'}
         </button>
      </div>
   );
};

export default FollowUser;
