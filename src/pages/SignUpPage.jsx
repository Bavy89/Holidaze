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
      <div className="flex flex-col items-center min-h-screen pt-24 bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-center text-cyan-600 mb-8">Sign up</h1>

          <p className="text-lg mb-6 text-center text-gray-600">Choose your account type</p>

          <Link
            onClick={() => {
              setIsSelectPage(false);
              setIsVenueManger(true);
            }}
            className="w-full py-4 mb-6 bg-cyan-600 text-white rounded-lg font-semibold text-center hover:bg-cyan-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md flex items-center justify-center space-x-2"
          >
            <span className="text-lg">Venue Manager</span>
          </Link>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-gray-300 w-full"></div>
            <span className="bg-white px-4 text-gray-500 text-sm">or</span>
            <div className="border-t border-gray-300 w-full"></div>
          </div>

          <button
            onClick={() => {
              setIsSelectPage(false);
              setIsVenueManger(false);
            }}
            className="w-full py-4 mb-8 bg-cyan-600 text-white rounded-lg font-semibold text-center hover:bg-cyan-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md flex items-center justify-center space-x-2"
          >
            <span className="text-lg">Guest</span>
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-600 font-semibold hover:text-cyan-700 underline"
            >
              Log in here!
            </Link>
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center min-h-screen p-6 pt-24 bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-center text-cyan-600 mb-8">Sign up</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Full name
              </label>
              <input
                type="text"
                {...register("fullName")}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all duration-200"
              />
              <p className="mt-1 text-red-500 text-sm">{errors.fullName?.message}</p>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="John@stud.noroff.no"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all duration-200"
              />
              <p className="mt-1 text-red-500 text-sm">{errors.email?.message}</p>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="********"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all duration-200"
              />
              <p className="mt-1 text-red-500 text-sm">{errors.password?.message}</p>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Confirm password
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                placeholder="********"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:outline-none transition-all duration-200"
              />
              <p className="mt-1 text-red-500 text-sm">
                {errors.confirmPassword?.message}
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
            >
              Sign up
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-600 font-semibold hover:text-cyan-700 underline"
            >
              Log in here!
            </Link>
          </p>
        </div>
      </div>
    );
  }
};

export default SignUpPage;
