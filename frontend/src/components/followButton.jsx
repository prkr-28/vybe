import axios from 'axios';
import React from 'react';
import {useSelector} from 'react-redux';
import {serverUrl} from '../App';
import {useDispatch} from 'react-redux';
import {toggleFollow} from '../redux/userSlice';

const FollowUser = ({targetUserId, tailwind, onFollowChange}) => {
   const {following} = useSelector((state) => state.user);
   const isFollowing = following.includes(targetUserId);
   const dispatch = useDispatch();

   const handleFollowToggle = async () => {
      try {
         await axios.post(
            `${serverUrl}/api/user/follow/${targetUserId}`,
            {targetUserId},
            {withCredentials: true}
         );
         dispatch(toggleFollow(targetUserId));
         if (onFollowChange) {
            onFollowChange();
         }
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
