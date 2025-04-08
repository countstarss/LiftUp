'use client';

import { useEffect } from 'react';

type Props = { children: React.ReactNode }

const Layout = (props: Props) => {
    useEffect(() => {
        console.log('[UserLayout] Rendering user layout');
    }, []);
    
    return props.children;
}

export default Layout;