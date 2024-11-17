import React, { createContext, useContext, useState } from "react";
import { typeAvailableLanguages } from "../types/typeAvailableLanguage";

type typeContextLanguage = {
  l: typeAvailableLanguages;
  updateLanguage: (newLanguage: typeAvailableLanguages) => void;
};

export const ContextLanguage = createContext<typeContextLanguage>({
  l: "it_IT",
  updateLanguage: () => {
    console.log("Language");
  },
});

export const useContextLanguage = () => useContext(ContextLanguage);

export const ProviderContextLanguage = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Variables ------------------------
  // UseStates ---------------------------
  const [l, setLanguage] = useState<typeAvailableLanguages>("it_IT");
  // UseEffects -----------------------
  // Functions ------------------------
  const updateLanguage = (newLanguage: typeAvailableLanguages) => {
    setLanguage(newLanguage);
  };
  // Return ---------------------------
  return (
    <ContextLanguage.Provider value={{ l, updateLanguage }}>
      {children}
    </ContextLanguage.Provider>
  );
};
