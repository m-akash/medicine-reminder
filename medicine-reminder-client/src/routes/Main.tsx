import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "../layouts/Root.tsx";
import Home from "../pages/Home/Home.tsx";
import MyMedications from "../pages/MyMedications/MyMedications.tsx";
import Medications from "../pages/Medications/Medications.tsx";
import Schedule from "../pages/Schedule/Schedule.tsx";
import Reports from "../pages/Reports/Reports.tsx";
import AddMedicine from "../pages/AddMedicine/AddMedicine.tsx";
import UpdateMedicine from "../pages/UpdateMedicine/UpdateMedicine.tsx";
import Register from "../pages/Register/Register.tsx";
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
      {
        path: "/register",
        element: <Register></Register>,
      },
    ],
  },
]);

export default router;
