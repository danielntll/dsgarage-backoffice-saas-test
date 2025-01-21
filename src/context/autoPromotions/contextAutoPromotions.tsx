import React, { useEffect, useState } from "react";
import { useContextLanguage } from "../contextLanguage";
import { useAuthContext } from "../contextAuth";
import { useContextToast } from "../systemEvents/contextToast";

type dataContext = {};

export const AutoAnnunciContext = React.createContext<dataContext>({});

export const useAutoAnnunciContext = () => React.useContext(AutoAnnunciContext);

export const AutoAnnunciContextProvider = ({ children }: any) => {
  // VARIABLES ------------------------------
  const { l } = useContextLanguage();
  const { authenticateUser } = useAuthContext();
  const { toast } = useContextToast();
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
    <AutoAnnunciContext.Provider value={{}}>
      {children}
    </AutoAnnunciContext.Provider>
  );
};
