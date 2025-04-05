import React from 'react';
import ProfilePage from './_components/Profile';


// ✅ 不需要 async
const Page = () => {
  return (
    <div className="w-full h-full overflow-y-auto pb-40">
      <ProfilePage />
    </div>
  );
};

export default Page;