import React, { useContext, useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic.tsx";
import AuthContext from "../../context/AuthContext.tsx";
import { data, useNavigate } from "react-router-dom";
import SocialLogin from "../shared/SocialLogin.tsx";

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
        alert("Registration successful!");
        setForm({ name: "", email: "", password: "" });
      }
      console.log(result);
      // navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(error?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-xl"
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
          className="w-full py-3 rounded-lg bg-blue-600 font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
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
        <SocialLogin></SocialLogin>
      </form>
    </div>
  );
};

export default Register;
