import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "../layouts/Root";
import Home from "../pages/Home/Home";
import MyMedications from "../pages/MyMedications/MyMedications";
import Medications from "../pages/Medications/Medications";
import Schedule from "../pages/Schedule/Schedule";
import Reports from "../pages/Reports/Reports";
import AddMedicine from "../pages/AddMedicine/AddMedicine";
import UpdateMedicine from "../pages/UpdateMedicine/UpdateMedicine";
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
      {
        path: "/schedule",
        element: <Schedule></Schedule>,
      },
      {
        path: "/reports",
        element: <Reports></Reports>,
      },
      {
        path: "/add-medicine",
        element: <AddMedicine></AddMedicine>,
      },
      {
        path: "/update-medicine",
        element: <UpdateMedicine></UpdateMedicine>,
      },
    ],
  },
]);

export default router;
