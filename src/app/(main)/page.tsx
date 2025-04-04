import PopularTeachers from '@/components/PopularTeachers';
import React from 'react';


const Page = () => {
  return (
    <>
      <div className="md:mx-20 mt-10 rounded-sm bg-white dark:bg-gray-800 p-6">
        <PopularTeachers />
      </div>
    </>
  );
};

export default Page;