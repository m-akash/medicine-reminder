import useAxiosSecure from "./useAxiosSecure.tsx";
import { useQuery } from "@tanstack/react-query";

const useMedicinesUser = (email: string) => {
  const axiosSecure = useAxiosSecure();

  const loadMedicineByEmail = async () => {
    const response = await axiosSecure.get(`/api/medicine/user/${email}`);
    return response.data;
  };

  return useQuery({
    queryKey: ["user-medicines", email],
    queryFn: loadMedicineByEmail,
    enabled: !!email,
  });
};

export default useMedicinesUser;
