import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import auth from "../firebase/firebase.init.ts";
import { AuthContextType, User } from "../types/index.ts";
import useAxiosPublic from "../hooks/useAxiosPublic.tsx";
import AuthContext from "./AuthContext.tsx";

const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const provider = new GoogleAuthProvider();
  const axiosPublic = useAxiosPublic();

  const createUser = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const data = await axiosPublic.post("/api/user/social-login", {
        email: result.user.email,
        name: result.user.displayName,
      });
      console.log(data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const userInfo: User = {
          id: currentUser.uid,
          name: currentUser.displayName || currentUser.email || "",
          email: currentUser.email || "",
          createdAt: new Date(),
          lastLogin: new Date(),
        };
        setUser(userInfo);
        axiosPublic.post("/jwt", { email: currentUser.email }).then((res) => {
          if (res.data.token) {
            localStorage.setItem("access-token", res.data.token);
          }
          setLoading(false);
        });
      } else {
        setUser(null);
        localStorage.removeItem("access-token");
        setLoading(false);
      }

      console.log("Auth state changed:", currentUser?.email);
    });

    return () => unsubscribe();
  }, [axiosPublic]);

  const userInfo: AuthContextType = {
    user,
    loading,
    loginUser,
    loginWithGoogle,
    createUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
