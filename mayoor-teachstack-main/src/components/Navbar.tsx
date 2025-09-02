import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext'; // Use useAppContext

const Navbar = () => {
  const { isLoggedIn, logout } = useAppContext(); // Use useAppContext

  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={isLoggedIn ? "/dashboard" : "/login"} className="text-2xl font-bold">
          TeachStack
        </Link>
        {isLoggedIn ? (
          <div className="flex space-x-4 items-center">
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/profile-management" className="hover:underline">Teachers</Link>
            <Link to="/reports" className="hover:underline">Reports</Link>
            <Button onClick={logout} variant="secondary" className="text-primary">Logout</Button>
          </div>
        ) : (
          <Link to="/login">
            <Button variant="secondary" className="text-primary">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;