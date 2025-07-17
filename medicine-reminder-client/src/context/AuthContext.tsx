import { createContext } from "react";
import { AuthContextType } from "../types/index.ts";

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  createUser: async () => {},
  loginUser: async () => {},
  logoutUser: async () => {},
  loginWithGoogle: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export default AuthContext;
