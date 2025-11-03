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
import { requestFCMToken } from "../firebase/firebase.init.ts";

const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const provider = new GoogleAuthProvider();
  const axiosPublic = useAxiosPublic();

  const createUser = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      if (!auth) throw new Error("Firebase is not configured");
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
      if (!auth) throw new Error("Firebase is not configured");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    const tokenForNotification = await requestFCMToken();
    setLoading(true);
    try {
      if (!auth) throw new Error("Firebase is not configured");
      const result = await signInWithPopup(auth, provider);
      // Try to sync user to backend, but do not block login on failure
      try {
        await axiosPublic.post("/api/user/social-login", {
          email: result.user.email,
          name: result.user.displayName,
          tokenForNotification,
        });
      } catch (apiError) {
        console.warn("social-login API failed", apiError);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      if (!auth) return;
      await signOut(auth);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    const userInfo = auth.currentUser;
    if (!userInfo) {
      alert("No user logged in");
      return;
    }
    try {
      const response = await axiosPublic.delete(
        `/api/user/${userInfo.email}/account`
      );
      if (response.status === 200) {
        console.log("Account deleted successfully:", response.data);
        await signOut(auth);
        localStorage.removeItem("access-token");
        setUser(null);
      }
    } catch (error: any) {
      console.error("Error deleting account:", error);

      if (error.response?.status === 404) {
        alert("User not found. Please try logging in again.");
      } else if (error.response?.status === 500) {
        alert("Server error. Please try again later.");
      } else {
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (!auth) {
      setUser(null);
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
        if (currentUser.email && window.Notification) {
          try {
            const tokenForNotification = await requestFCMToken();
            if (tokenForNotification) {
              await axiosPublic.post("/api/user/save-fcm-token", {
                email: currentUser.email,
                tokenForNotification,
              });
            }
          } catch (err) {
            console.error("FCM token error", err);
          }
        }
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
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
