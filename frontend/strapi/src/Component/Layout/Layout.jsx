// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar, Sidebar } from '..';

const Layout = () => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col w-full ml-64">
                <Navbar />
                <main className="flex-grow p-4 mt-12">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
