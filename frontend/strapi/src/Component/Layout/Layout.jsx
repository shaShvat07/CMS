// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from '..';

const Layout = () => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col w-full">
                <Navbar />
                <main className="flex-grow p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
