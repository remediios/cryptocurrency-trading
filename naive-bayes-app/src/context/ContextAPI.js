import React, { createContext, useState } from "react";

export const ContextAPI = createContext();

export function ContextProvider({ children }) {
  const [currencyName, setCurrencyName] = useState("");
  const [currencyData, setCurrencyData] = useState([]);

  return (
    <ContextAPI.Provider
      value={{ currencyName, setCurrencyName, currencyData, setCurrencyData }}
    >
      {children}
    </ContextAPI.Provider>
  );
}
