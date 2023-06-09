import React, { createContext, useState } from "react";

export const ContextAPI = createContext();

export function ContextProvider({ children }) {
  const [currencyName, setCurrencyName] = useState("");

  return (
    <ContextAPI.Provider value={{ currencyName, setCurrencyName }}>
      {children}
    </ContextAPI.Provider>
  );
}
