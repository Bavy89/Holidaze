import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { apiPost } from "../utils/apiKey";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .matches(
      /^[\w.+-]+@stud\.noroff\.no$/,
      "Email must end with @stud.noroff.no"
    )
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await apiPost("/auth/login", data);
      console.log("Login successful:", response);

      const { accessToken, name } = response.data;

      if (accessToken) {
        localStorage.setItem("token", accessToken);
      } else {
        throw new Error("Access token is missing in the response.");
      }

      if (name) {
        localStorage.setItem("user", name);
        navigate(`/profiles/${name}`, { replace: true });
      } else {
        throw new Error("User name is missing in the response.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to login. Please check your credentials and try again.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 pt-36">
      <h1 className="text-3xl text-text mb-8">Log in</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4"
      >
        <div>
          <label className="block text-text text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            {...register("email")}
            placeholder="John@stud.noroff.no"
            className="w-full border border-gray-300 rounded px-3 py-2 text-text"
          />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>

        <div>
          <label className="block text-text text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            placeholder="********"
            className="w-full border border-gray-300 rounded px-3 py-2 text-text"
          />
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        </div>

        <button
          type="submit"
          className="w-full bg-main-red text-background py-2 rounded font-semibold hover:bg-red-800 transition"
        >
          Log in
        </button>
      </form>

      <p className="text-text mt-4">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-main-red underline hover:text-red-800"
        >
          Sign up here!
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
