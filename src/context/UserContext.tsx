"use client";
import { createContext, useContext, useState } from "react";

interface UserContextType {
  user: boolean;
  setUser: (v: boolean) => void;
}

const UserContext = createContext<UserContextType>({ user: false, setUser: () => {} });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(false);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
