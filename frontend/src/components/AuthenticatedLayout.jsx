import React from 'react';
import Sidebar from './Sidebar';

export default function AuthenticatedLayout({ children }) {
  return (
    <div className="flex w-full min-h-[calc(100vh-64px)]">
      <Sidebar />
      <div className="flex-1 p-6 md:p-8 overflow-x-hidden md:ml-64 w-full">
        {children}
      </div>
    </div>
  );
}
