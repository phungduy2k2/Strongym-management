"use client";

import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [isAuthUser, setIsAuthUser] = useState(false);
  const [user, setUser] = useState(null);


  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        isAuthUser,
        setIsAuthUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
