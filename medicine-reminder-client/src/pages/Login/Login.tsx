import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext.tsx";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SocialLogin from "../shared/SocialLogin.tsx";
import BaseHelmet from "../../components/BaseHelmet.tsx";
import { authNotifications } from "../../utils/notifications.ts";

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(form.email, form.password);
      setForm({ email: "", password: "" });
      authNotifications.loginSuccess();
      navigate(from, { replace: true });
    } catch (error: any) {
      authNotifications.loginError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BaseHelmet
        title="Login - Medicine Reminder"
        description="Sign in to your Medicine Reminder account to manage your medications and health schedule."
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 shadow-lg">
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 shadow-lg p-10 md:rounded-4xl rounded-3xl md:w-full md:max-w-xl"
        >
          <h2 className="mb-8 text-3xl font-bold text-center text-black">
            Login
          </h2>
          <div className="mb-6">
            <label className="block mb-2 text-black font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-black text-black"
            />
          </div>
          <div className="mb-8">
            <label className="block mb-2 text-black font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-black text-black"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-100 via-indigo-200 to-amber-50 text-gray-600 font-semibold text-lg shadow-md transform transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="relative my-8">
            <SocialLogin></SocialLogin>
          </div>
          <div className="text-center">
            <p className="text-gray-500">
              New to here?{" "}
              <Link
                to="/register"
                className="text-yellow-700 hover:text-yellow-600 font-semibold transition-colors duration-300 hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
