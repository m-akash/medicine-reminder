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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 md:rounded-2xl shadow-lg w-full max-w-xl"
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
            <label className="block mb-2 text-black font-medium">Password</label>
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
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-md transform transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-gray-300 font-medium">
                Or continue with
              </span>
            </div>
          </div>
          <SocialLogin />
          <div className="text-center">
            <p className="text-gray-300">
              New to here?{" "}
              <Link
                to="/register"
                className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors duration-300 hover:underline"
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
