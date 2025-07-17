import React, { useContext, useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic.tsx";
import AuthContext from "../../context/AuthContext.tsx";

const Register = () => {
  const { createUser, loginUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const axiosPublic = useAxiosPublic();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // First, register with Firebase and backend (handled in context)
      await createUser(form.email, form.password, form.name);
      alert("Registration successful!");
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error?.message || error?.response?.data?.message || "Registration failed.");
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
          className="w-full py-3 rounded-lg bg-blue-600  font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
