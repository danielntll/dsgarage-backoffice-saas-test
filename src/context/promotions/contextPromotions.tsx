import React, { useContext, useEffect, useState } from "react";
import { ContextLanguage } from "../contextLanguage";
import { AuthContext } from "../contextAuth";
import { ContextToast } from "../contextToast";

type dataContext = {};

export const PromotionsContext = React.createContext<dataContext>({});

export const usePromotionsContext = () => React.useContext(PromotionsContext);

export const PromotionsContextProvider = ({ children }: any) => {
  // VARIABLES ------------------------------
  const { l } = useContext(ContextLanguage);
  const { authenticateUser } = useContext(AuthContext);
  const { toast } = useContext(ContextToast);
  // USE STATE -----------------------------
  // USE EFFECT ------------------------------
  useEffect(() => {
    if (authenticateUser !== undefined) {
      initData();
    }
  }, [authenticateUser]);
  // FUNCTIONS ------------------------------

  // ---  initData
  /**
   *
   */
  const initData = async () => {};

  // RETURN ---------------------------------
  return (
    <PromotionsContext.Provider value={{}}>
      {children}
    </PromotionsContext.Provider>
  );
};
