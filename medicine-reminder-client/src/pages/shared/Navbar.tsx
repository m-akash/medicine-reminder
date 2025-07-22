import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.tsx";
import defaultPhoto from "../../assets/others/profile.png";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser()
      .then(() => {
        alert("Logout successfully!");
        navigate("/");
      })
      .catch(() => {
        alert("Unsuccessfull attempt!");
      });
  };
  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              isActive
                ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md"
                : "text-white hover:bg-amber-400/20 hover:text-amber-200"
            }`
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/medication"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              isActive
                ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md"
                : "text-white hover:bg-amber-400/20 hover:text-amber-200"
            }`
          }
        >
          Medications
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/schedule"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              isActive
                ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md"
                : "text-white hover:bg-amber-400/20 hover:text-amber-200"
            }`
          }
        >
          Schedule
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              isActive
                ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md"
                : "text-white hover:bg-amber-400/20 hover:text-amber-200"
            }`
          }
        >
          Reports
        </NavLink>
      </li>
    </>
  );
  return (
    <div className="navbar bg-gradient-to-r from-blue-700 via-indigo-800 to-amber-600 shadow-lg py-2 px-4 sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-gradient-to-br from-blue-800 via-indigo-900 to-amber-700 rounded-xl z-20 mt-3 w-56 p-3 shadow-xl"
          >
            {navLinks}
          </ul>
        </div>
        <button className="btn btn-ghost text-2xl font-extrabold tracking-tight text-white drop-shadow-lg">
          <Link to="/">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-700">
              Medi
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                Rem
              </span>
            </span>
          </Link>
        </button>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2">{navLinks}</ul>
      </div>
      <div className="navbar-end flex items-center gap-2">
        <div className="dropdown dropdown-end">
          <button className="btn btn-ghost btn-circle relative group">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white animate-bounce group-hover:animate-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="badge badge-xs badge-primary indicator-item animate-pulse"></span>
            </div>
          </button>
        </div>
        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar border-2 border-amber-400 hover:border-amber-600 transition-all duration-300"
            >
              <div className="w-11 rounded-full ring ring-amber-400 ring-offset-base-100 ring-offset-2 overflow-hidden">
                <img alt="User avatar" src={user?.photoURL || defaultPhoto} />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-gradient-to-br from-blue-800 via-indigo-900 to-amber-700 rounded-xl z-20 mt-3 w-56 p-3 shadow-xl"
            >
              <li>
                <a className="flex items-center gap-2">
                  <span className="font-semibold text-white">Profile</span>
                  <span className="badge badge-accent">New</span>
                </a>
              </li>
              <li>
                <a className="text-white">Settings</a>
              </li>
              <li>
                <Link
                  to="/logout"
                  onClick={handleLogout}
                  className="text-white"
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="dropdown dropdown-end">
            <Link to="/login">
              <button className="px-6 py-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-bold rounded-lg shadow-md transition-all duration-300 hover:from-amber-500 hover:to-amber-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2">
                Login
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
