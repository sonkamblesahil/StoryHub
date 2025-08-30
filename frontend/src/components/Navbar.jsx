import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.username);
    } else {
      setUsername('');
    }
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Stories', path: '/allstories' },
    { name: 'Create Story', path: '/create' },
  ];

  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-gradient-to-r from-indigo-700 to-purple-700 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-white font-extrabold text-2xl tracking-wide"
          >
            <span className="w-10 h-10 flex items-center justify-center bg-yellow-300 rounded-full text-indigo-900 font-bold">
              sttt
            </span>
            <span>Story Hub</span>
          </Link>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center space-x-6 text-white font-semibold">
          {navLinks.map((link, idx) => (
            <li key={idx}>
              <Link
                to={link.path}
                className={`relative px-3 py-2 rounded-lg ${
                  location.pathname === link.path
                    ? 'bg-yellow-300 text-indigo-900'
                    : 'hover:text-yellow-200'
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Profile Section */}
        {username ? (
          <div className="hidden md:flex items-center space-x-2 text-white font-semibold">
            <UserCircleIcon className="w-8 h-8 text-yellow-300 drop-shadow" />
            <Link to="/profile" className="hover:text-yellow-200 font-bold">
              {username}
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex space-x-4">
            <Link to="/login" className="text-white hover:text-yellow-200 font-bold">
              Login
            </Link>
            <Link to="/signup" className="text-white hover:text-yellow-200 font-bold">
              Sign Up
            </Link>
          </div>
        )}

        {/* Mobile Menu Button */}
        <div
          className="md:hidden text-white text-2xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✖' : '☰'}
        </div>
      </div>

      {/* Mobile Dropdown (no animation) */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-b from-indigo-700 to-purple-700 text-white px-6 py-4 space-y-4 shadow-lg">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block transition ${
                location.pathname === link.path
                  ? 'text-yellow-300 font-bold'
                  : 'hover:text-yellow-200'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {username ? (
            <div className="flex items-center space-x-2 font-semibold pt-3 border-t border-gray-600">
              <UserCircleIcon className="w-6 h-6 text-yellow-300" />
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="hover:text-yellow-200"
              >
                {username}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 border-t border-gray-600 pt-3">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="hover:text-yellow-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="hover:text-yellow-200"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
