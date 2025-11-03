import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL || "https://medicine-reminder-api-production.up.railway.app";

const axiosPublic = axios.create({
  baseURL,
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
