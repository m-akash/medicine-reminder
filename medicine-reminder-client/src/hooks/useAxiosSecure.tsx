import React from "react";
import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "http://localhost:8000",
});

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
