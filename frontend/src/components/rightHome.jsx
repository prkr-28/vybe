import React from 'react';
import Message from '../pages/message';

const RightHome = () => {
   return (
      <div className="w-[25%] hidden lg:block min-h-[100vh] bg-black border-l-1 border-gray-800 ">
         <Message />
      </div>
   );
};

export default RightHome;
