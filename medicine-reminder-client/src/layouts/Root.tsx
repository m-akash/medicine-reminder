import Navbar from "../pages/shared/Navbar.tsx";
import { Outlet } from "react-router-dom";
import Footer from "../pages/shared/Footer.tsx";

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
