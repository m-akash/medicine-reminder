import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "../layouts/Root";
import Home from "../pages/Home/Home";
import MyMedications from "../pages/MyMedications/MyMedications";
import Medications from "../pages/Medications/Medications";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/medication",
        element: <Medications />,
      },
    ],
  },
]);

export default router;
