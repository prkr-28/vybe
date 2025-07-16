import React from 'react';
import LeftHome from '../components/leftHome';
import FeedHome from '../components/feedHome';
import RightHome from '../components/rightHome';

const Home = () => {
   return (
      <div className="w-full flex justify-center items-start">
         {/* left div */}
         <LeftHome />
         {/* middle div */}
         <FeedHome />
         {/* right div */}
         <RightHome />
      </div>
   );
};

export default Home;
