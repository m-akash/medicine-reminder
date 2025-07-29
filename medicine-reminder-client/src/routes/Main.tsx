import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "../layouts/Root.tsx";
import Home from "../pages/Home/Home.tsx";
import Medications from "../pages/Medications/Medications.tsx";
import Schedule from "../pages/Schedule/Schedule.tsx";
import Reports from "../pages/Reports/Reports.tsx";
import AddMedicine from "../pages/AddMedicine/AddMedicine.tsx";
import UpdateMedicine from "../pages/UpdateMedicine/UpdateMedicine.tsx";
import Settings from "../pages/Settings/Settings.tsx";
import Register from "../pages/Register/Register.tsx";
import Login from "../pages/Login/Login.tsx";
import PrivateRoute from "./PrivateRoute.tsx";
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
        element: (
          <PrivateRoute>
            <Medications />
          </PrivateRoute>
        ),
      },
      {
        path: "/schedule",
        element: (
          <PrivateRoute>
            <Schedule />
          </PrivateRoute>
        ),
      },
      {
        path: "/reports",
        element: (
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        ),
      },
      {
        path: "/add-medicine",
        element: (
          <PrivateRoute>
            <AddMedicine />
          </PrivateRoute>
        ),
      },
      {
        path: "/update-medicine/:id",
        element: (
          <PrivateRoute>
            <UpdateMedicine />
          </PrivateRoute>
        ),
        loader: ({ params }) =>
          fetch(
            `https://medicine-reminder-api.vercel.app/api/medicine/${params.id}`
          ),
      },
      {
        path: "/settings",
        element: (
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        ),
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
    ],
  },
]);

export default router;
