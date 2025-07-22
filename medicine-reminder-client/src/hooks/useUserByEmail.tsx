import useAuth from "./useAuth.tsx";
import useAxiosSecure from "./useAxiosSecure.tsx";
import { useQuery } from "@tanstack/react-query";

const fetchUserByEmail = async (email: string) => {
  const axiosSecure = useAxiosSecure();
  const response = await axiosSecure.get(`/api/user?email=${email}`);
  return response.data;
};

const useUserByEmail = (email: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user", user?.email],
    queryFn: () => fetchUserByEmail,
    enabled: !!email,
  });
};

export default useUserByEmail;
