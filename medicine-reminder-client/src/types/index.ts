export interface User {
  id: string;
  name: string;
  displayName?: string;
  email: string;
  password?: string;
  photoURL?: string;
  createdAt: Date;
  lastLogin?: Date;
  // role: "user" | "admin";
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  createUser: (email: string, password: string, name: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface ChildrenProps {
  children: React.ReactNode;
}

export interface Medicine {
  id: string;
  userEmail: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  durationDays: number;
  instructions?: string;
}
