import useAuth from "./useAuth.tsx";
import useAxiosSecure from "./useAxiosSecure.tsx";
import { useQuery } from "@tanstack/react-query";

const useUserByEmail = (email: string) => {
  const axiosSecure = useAxiosSecure();
  const fetchUserByEmail = async () => {
    const response = await axiosSecure.get(`/api/user/${email}`);
    return response.data;
  };
  return useQuery({
    queryKey: ["user", email],
    queryFn: fetchUserByEmail,
    enabled: !!email,
  });
};

export default useUserByEmail;
