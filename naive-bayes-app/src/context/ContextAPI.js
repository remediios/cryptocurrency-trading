import React, { createContext, useState } from "react";

export const ContextAPI = createContext();

export function ContextProvider({ children }) {
  const [currencyName, setCurrencyName] = useState("bitcoin");
  const [currencyData, setCurrencyData] = useState([]);
  const [currencyID, setCurrencyID] = useState("bitcoin");
  const [currencySymbol, setCurrencySymbol] = useState("btc");
  const [currencyImg, setCurrencyImg] = useState("");

  return (
    <ContextAPI.Provider
      value={{
        currencyName,
        setCurrencyName,
        currencyID,
        setCurrencyID,
        currencyData,
        setCurrencyData,
        currencySymbol,
        setCurrencySymbol,
        currencyImg,
        setCurrencyImg,
      }}
    >
      {children}
    </ContextAPI.Provider>
  );
}
