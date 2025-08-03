import Navbar from "../pages/shared/Navbar.tsx";
import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Navbar></Navbar>
      <Outlet></Outlet>
    </div>
  );
};

export default Root;
