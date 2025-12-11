"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  User,
  ParsedToken,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { setToken, removeToken } from "./actions";
import { auth } from "@/firebase/client";

type AuthContextType = {
  currentUser: User | null;
  customClaims: ParsedToken | null;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [customClaims, setCustomClaims] = useState<ParsedToken | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user ?? null);

      if (user) {
        const tokenResult = await user.getIdTokenResult();
        const token = tokenResult.token;
        const refreshToken = user.refreshToken;
        const claims = tokenResult.claims;

        setCustomClaims(claims);

        if (token && refreshToken) {
          await setToken({ token, refreshToken });
        }
      } else {
        setCustomClaims(null);
        await removeToken();
      }
    });
    return () => unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  }, []);

  const value = useMemo(
    () => ({ currentUser, customClaims, logout, loginWithGoogle }),
    [currentUser, customClaims, logout, loginWithGoogle]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
