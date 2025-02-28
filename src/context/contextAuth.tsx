import React, { useContext, useEffect, useState } from "react";

import { Auth, onAuthStateChanged, User } from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";
import { IonLoading } from "@ionic/react";
import { useHistory } from "react-router";
import { authenticatedRoutesOutlet, loginRoutesOutlet } from "../App";
import { ContextLanguage } from "./contextLanguage";
import { ContextToast } from "./systemEvents/contextToast";
import { DataContextProvider } from "./contextData";
import { GalleryContextProvider } from "./gallery/contextGallery";
import { CarPromotionContextProvider } from "./car promotion/contextCarPromotion";

type AuthType = {
  authenticateUser: User | undefined;
  auth: Auth;
};

export const AuthContext = React.createContext<AuthType>({
  authenticateUser: undefined,
  auth,
});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = () => {
  // VARIABLES ------------------------------
  const history = useHistory();
  const { l } = useContext(ContextLanguage);
  const { toast } = useContext(ContextToast);
  // USE STATES -----------------------------
  const [authenticateUser, setAuthenticateUser] = useState<User | undefined>(
    undefined
  );
  const [currentAuth, setCurrentAuth] = useState<Auth>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // USE EFFECTS -----------------------------
  useEffect(() => {
    if (currentAuth != null || currentAuth != undefined) {
      setIsLoading(false);
    }
    onAuthStateChanged(auth, (user) => {
      setAuthenticateUser(user == null ? undefined : user);
      setCurrentAuth(auth);
      setIsLoading(false);
      if (user) {
        setAuthenticateUser(user);
        history.push("/");
      } else {
        history.replace("/");
      }
    });
  }, [currentAuth]);
  // FUNCTIONS ------------------------------
  // RETURN ----------------------------------
  return (
    <AuthContext.Provider
      value={{
        auth,
        authenticateUser,
      }}
    >
      {isLoading ? (
        <IonLoading isOpen={isLoading} message="Loading..." spinner="circles" />
      ) : null}
      {authenticateUser ? (
        <DataContextProvider>
          <GalleryContextProvider>
            <CarPromotionContextProvider>
              {authenticatedRoutesOutlet()}
            </CarPromotionContextProvider>
          </GalleryContextProvider>
        </DataContextProvider>
      ) : (
        loginRoutesOutlet()
      )}
    </AuthContext.Provider>
  );
};
