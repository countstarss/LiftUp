import React from 'react';

interface LayoutProps {
  // You can define any props needed here
  children: React.ReactNode;
}

const Layout = ({
  children
}: LayoutProps) => {


  return (
    <>
      <section className="max-w-7xl mx-auto px-4 md:px-8 my-10 h-fit light:bg-gray-400">
        {children}
      </section>
      {/* <Fotter /> */}
      {/* <BottomFotter /> */}
    </>
  );
};

export default Layout;