import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://medicine-reminder-api-production.up.railway.app",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
