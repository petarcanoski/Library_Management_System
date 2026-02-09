import React from 'react';
import AppNavbar from './AppNavbar';

/**
 * Layout Component
 * Wraps pages with navigation and provides consistent layout
 *
 * @param {React.ReactNode} children - Page content
 * @param {boolean} showNavbar - Whether to show the navbar (default: true)
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
