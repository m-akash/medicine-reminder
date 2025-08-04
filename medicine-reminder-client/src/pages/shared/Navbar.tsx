import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth.tsx";
import defaultPhoto from "../../assets/others/profile.png";
import useUserByEmail from "../../hooks/useUserByEmail.tsx";
import { User } from "../../types/index.ts";
import NotificationDropdown from "../../components/NotificationDropdown.tsx";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const email = user?.email || "";
  const { data } = useUserByEmail(email);
  const userInfo: User | undefined = data?.findUser;

  const firstName = userInfo?.name.split(" ")[0] || "";
  const firstInitial = firstName?.charAt(0)?.toUpperCase() || "?";
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser()
      .then(() => {
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
                ? "bg-gradient-to-r from-amber-200 to-indigo-200 text-black shadow-lg"
                : "text-black hover:bg-amber-600/20 hover:text-gray-700"
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
                ? "bg-gradient-to-r from-amber-200 to-indigo-200 text-black shadow-lg"
                : "text-black hover:bg-amber-600/20 hover:text-gray-700"
            }`
          }
        >
          Medications
        </NavLink>
      </li>
      {/* <li>
        <NavLink
          to="/schedule"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              isActive
                ? "bg-gradient-to-r from-amber-200 to-indigo-200 text-black shadow-lg"
                : "text-black hover:bg-amber-600/20 hover:text-gray-700"
            }`
          }
        >
          Schedule
        </NavLink>
      </li> */}
      <li>
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
              isActive
                ? "bg-gradient-to-r from-amber-200 to-indigo-200 text-black shadow-lg"
                : "text-black hover:bg-amber-600/20 hover:text-gray-700"
            }`
          }
        >
          Reports
        </NavLink>
      </li>
    </>
  );
  return (
    <div className="navbar bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 shadow-lg py-2 px-4 sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-900"
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
            className="menu menu-sm dropdown-content bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 shadow-lg rounded-xl z-20 mt-3 w-56 p-3"
          >
            {navLinks}
          </ul>
        </div>
        <button className="btn btn-ghost hover:bg-gradient-to-r from-amber-200 to-indigo-200 text-2xl font-extrabold tracking-tight text-white drop-shadow-lg">
          <Link to="/">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-700">
              Medi
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                Ping
              </span>
            </span>
          </Link>
        </button>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2">{navLinks}</ul>
      </div>
      <div className="navbar-end flex items-center gap-4">
        {user && <NotificationDropdown userEmail={email} />}
        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar group relative"
            >
              <div className="w-14 rounded-full bg-amber-100 ring-2 ring-amber-200 ring-offset-base-100 transform transition-all duration-300 group-hover:scale-105 group-hover:ring-amber-200 overflow-hidden flex items-center justify-center">
                <span className="text-2xl font-medium bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent flex items-center justify-center w-full h-full">
                  {firstInitial}
                </span>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 shadow-lg rounded-xl z-20 mt-4 w-64 p-4 border border-amber-400/20 backdrop-blur-sm"
            >
              <li className="mb-2">
                <Link
                  to="/settings"
                  className="text-black hover:bg-white/10 rounded-lg transition-all duration-300 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Profile & Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/logout"
                  onClick={handleLogout}
                  className="text-black hover:bg-white/10 rounded-lg transition-all duration-300 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="dropdown dropdown-end">
            <Link to="/login">
              <button className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-indigo-400 text-white font-bold rounded-lg shadow-lg transition-all duration-300 hover:from-amber-500 hover:to-amber-700 hover:scale-105 hover:shadow-amber-400/30 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 active:scale-95">
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
