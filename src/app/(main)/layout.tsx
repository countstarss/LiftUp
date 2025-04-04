import React from 'react';

interface LayoutProps {
  // You can define any props needed here
  children: React.ReactNode;
}

const Layout = ({
  children
}: LayoutProps) => {


  return (
      <div className="flex flex-col gap-4 items-center justify-center">
        {children}
      </div>
  );
};

export default Layout;