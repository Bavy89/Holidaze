import React from "react";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background font-Poppins">
        {children}
      </main>
    </>
  );
};

export default MainLayout;
