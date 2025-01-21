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
   <div className="flex flex-col items-center min-h-screen pt-24 bg-gray-50">
     <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
       <h1 className="text-4xl font-bold text-center text-cyan-600 mb-8">Log in</h1>

       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

         <button
           type="submit"
           className="w-full py-4 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-md"
         >
           Log in
         </button>
       </form>

       <p className="text-center text-gray-600 mt-6">
         Don't have an account?{" "}
         <Link
           to="/signup"
           className="text-cyan-600 font-semibold hover:text-cyan-700 underline"
         >
           Sign up here!
         </Link>
       </p>
     </div>
   </div>
 );
};

export default LoginPage;
