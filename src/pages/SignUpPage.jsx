import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiPost } from "../utils/apiKey";

const SignUpSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  email: Yup.string()
    .email("Invalid email")
    .matches(
      /^[\w.+-]+@stud\.noroff\.no$/,
      "Email must end with @stud.noroff.no"
    )
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password too short")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const SignUpPage = () => {
  const [isSelectPage, setIsSelectPage] = useState(true);
  const [isVenueManager, setIsVenueManger] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignUpSchema),
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.fullName,
        email: data.email,
        password: data.password,
        venueManager: isVenueManager,
      };

      const response = await apiPost("/auth/register", payload);
      console.log("User registered successfully:", response);
      navigate(`/login`, { replace: true });
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Failed to register. Please try again.");
    }
  };

  if (isSelectPage) {
    return (
      <div className="flex flex-col items-center min-h-screen pt-36">
        <h1 className="text-3xl text-text mb-8">Sign up</h1>

        <p className="text-lg mb-4 text-text">Sign up as</p>

        <Link
          onClick={() => {
            setIsSelectPage(false);
            setIsVenueManger(true);
          }}
          className="w-64 py-6 mb-4 bg-main-red text-background rounded font-semibold text-center"
        >
          Venue Manager
        </Link>

        <p className="text-lg mb-4 text-text">or</p>

        <button
          onClick={() => {
            setIsSelectPage(false);
            setIsVenueManger(false);
          }}
          className="w-64 py-6 mb-4 bg-main-red text-background rounded font-semibold text-center"
        >
          Guest
        </button>

        <p className="text-text">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-700 underline hover:text-red-800"
          >
            Log in here!
          </Link>
        </p>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center min-h-screen p-6 pt-36">
        <h1 className="text-3xl text-text mb-8">Sign up</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-sm space-y-4"
        >
          <div>
            <label className="block text-text text-sm font-medium mb-1">
              Full name
            </label>
            <input
              type="text"
              {...register("fullName")}
              placeholder="John Doe"
              className="w-full border border-gray-300 rounded px-3 py-2 text-text"
            />
            <p className="text-red-500 text-sm">{errors.fullName?.message}</p>
          </div>

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

          <div>
            <label className="block text-text text-sm font-medium mb-1">
              Confirm password
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="********"
              className="w-full border border-gray-300 rounded px-3 py-2 text-text"
            />
            <p className="text-red-500 text-sm">
              {errors.confirmPassword?.message}
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-main-red text-background py-2 rounded font-semibold hover:bg-red-800 transition"
          >
            Sign up
          </button>
        </form>

        <p className="text-text mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-main-red underline hover:text-red-800"
          >
            Log in here!
          </Link>
        </p>
      </div>
    );
  }
};

export default SignUpPage;
