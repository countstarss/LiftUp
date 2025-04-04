import React from 'react';
import ProfilePage from './_components/Profile';
import { redirect } from 'next/navigation';

interface PageProps {
  params: {
    username: string;
  }
}

const Page = async ({ params }: PageProps) => {

  return (
    <div className="w-full h-screen overflow-y-auto">
      <ProfilePage />
    </div>
  );
};

export default Page;