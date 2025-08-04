import React, { useContext, useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic.tsx";
import AuthContext from "../../context/AuthContext.tsx";
import { Link, useNavigate } from "react-router-dom";
import SocialLogin from "../shared/SocialLogin.tsx";
import BaseHelmet from "../../components/BaseHelmet.tsx";
import { authNotifications } from "../../utils/notifications.ts";

const Register = () => {
  const { createUser, logoutUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser(form.email, form.password, form.name).then(() => {
        logoutUser();
      });
      const result = await axiosPublic.post("/api/user/register", form);
      if (result.statusText === "Created") {
        authNotifications.registerSuccess();
        setForm({ name: "", email: "", password: "" });
      }
      console.log(result);
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      authNotifications.registerError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BaseHelmet
        title="Register - Medicine Reminder"
        description="Create your Medicine Reminder account to start managing your medications and health schedule effectively."
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 shadow-lg">
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-r from-emerald-50 via-indigo-100 to-amber-100 shadow-lg p-10 md:rounded-4xl rounded-3xl md:w-full max-w-xl"
        >
          <h2 className="mb-8 text-3xl font-bold text-center text-black">
            Register
          </h2>
          <div className="mb-6">
            <label className="block mb-2 text-black font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-black text-black"
            />
          </div>
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
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="relative my-8">
            <SocialLogin></SocialLogin>
          </div>
          <div className="text-center">
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-yellow-700 hover:text-yellow-600 font-semibold transition-colors duration-300 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
