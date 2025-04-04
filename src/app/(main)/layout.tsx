import React from 'react';

interface LayoutProps {
  // You can define any props needed here
  children: React.ReactNode;
}

const Layout = ({
  children
}: LayoutProps) => {


  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 my-10 h-fit light:bg-gray-400">
      <div className="flex flex-col gap-4 items-center justify-center">
        {children}
      </div>
    </main>
  );
};

export default Layout;