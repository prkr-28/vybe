import React from 'react';
import LeftHome from '../components/leftHome';
import FeedHome from '../components/feedHome';
import RightHome from '../components/rightHome';
import {useSelector} from 'react-redux';

const Home = () => {
   const {postData} = useSelector((state) => state.post);

   return (
      <div className="w-full flex justify-center items-start">
         {/* left div */}
         <LeftHome />

         {/* middle div */}
         <FeedHome postData={postData} />

         {/* right div */}
         <RightHome />
      </div>
   );
};

export default Home;
