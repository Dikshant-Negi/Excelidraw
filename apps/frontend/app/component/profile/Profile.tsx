"use client";
import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "@/app/config";
import toast from "react-hot-toast";
import { RotatingLines } from "react-loader-spinner";
export default function Profile() {
  const [loader, setLoader] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoader(true);
    if (isLogin) {
      const response = await axios.post(`${backendUrl}/auth/signin`, {
        email: form.email,
        password: form.password,
      });
      if (response.status === 200) {
        localStorage.setItem("token", response.data?.token);
        toast.success("Logged In");
      } else {
        toast.success("User not found");
      }
    } else {
      const response = await axios.post(`${backendUrl}/auth/signup`, {
        email: form.email,
        password: form.password,
        name: form.username,
      });
      if (response.status === 200) {
        toast.success("User created successfully");
        setIsLogin(false);
      } else {
        toast.error(response.data?.message || "An error occurred");
      }
    }
    setLoader(false);
  };
  if (loader)
    return (
      <div className="flex h-full w-full items-center justify-between bg-black">
        <RotatingLines />
      </div>
    );
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0] dark:bg-[#1e1e1e] px-4">
      <div className="w-full max-w-md bg-white dark:bg-[#2c2f35] p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {!isLogin && (
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full p-3 mb-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        )}

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
          >
            {showPassword ? (
              <span role="img" aria-label="Hide">
                🙈
              </span>
            ) : (
              <span role="img" aria-label="Show">
                👁️
              </span>
            )}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg bg-[#4f46e5] text-white font-semibold hover:bg-[#4338ca] transition"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline ml-1"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
