import React from "react";
import Navbar from "../pages/shared/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../pages/shared/Footer";

const Root = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default Root;
