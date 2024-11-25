import React, { useContext, useEffect, useState } from "react";

import {
  Auth,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
  User,
} from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";
import {
  IonButton,
  IonContent,
  IonLabel,
  IonLoading,
  IonModal,
} from "@ionic/react";
import { useHistory } from "react-router";
import { authenticatedRoutesOutlet, loginRoutesOutlet } from "../App";
import { textAuthContext } from "../text/textAuthContext";
import { ContextLanguage } from "./contextLanguage";
import { ContextToast } from "./systemEvents/contextToast";
import { DataContextProvider } from "./contextData";

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
  const [isModalVerifyEmailSend, setIsModalVerifyEmailSend] =
    useState<boolean>(false);
  // USE EFFECTS -----------------------------
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setAuthenticateUser(user == null ? undefined : user);
      setCurrentAuth(auth);
      setIsLoading(false);
      if (user) {
        if (user?.emailVerified) {
          setAuthenticateUser(user);
          toast("success", textAuthContext[l].info_welcome_back);
          setIsModalVerifyEmailSend(false);
        } else {
          setIsModalVerifyEmailSend(true);
          signOut(auth);
        }
        history.push("/");
      } else {
        history.replace("/");
      }
    });
  }, []);
  // FUNCTIONS ------------------------------
  const handleSendAgainVerification = async () => {
    try {
      await sendEmailVerification(currentAuth!.currentUser!).then(() => {
        toast("success", textAuthContext[l].success_verificationAgain);
      });
    } catch (error) {
      toast("danger", textAuthContext[l].error_generico);
    }
  };
  // RETURN ----------------------------------
  return (
    <AuthContext.Provider
      value={{
        auth,
        authenticateUser,
      }}
    >
      {isLoading ? (
        <IonLoading
          isOpen={isLoading}
          duration={2000}
          message="Loading..."
          spinner="circles"
        />
      ) : null}
      {authenticateUser?.emailVerified == true ? (
        <DataContextProvider>{authenticatedRoutesOutlet()}</DataContextProvider>
      ) : (
        loginRoutesOutlet()
      )}

      {!authenticateUser?.emailVerified ? (
        <IonModal
          isOpen={isModalVerifyEmailSend}
          onDidDismiss={() => setIsModalVerifyEmailSend(false)}
          initialBreakpoint={0.35}
          breakpoints={[0.35, 0.5]}
        >
          <IonContent>
            <IonLabel>
              <h2 className={"forgotTitle"}>
                {textAuthContext[l].modalVerifySendTitle}
              </h2>
            </IonLabel>
            <div className="ion-padding">
              <IonLabel>
                <p>{textAuthContext[l].modalVerifySendParagraph}</p>
              </IonLabel>

              <IonLabel>
                <p className="ion-padding-top">
                  {textAuthContext[l].modalVerifyCheck}
                </p>
              </IonLabel>
              <div className="ion-padding">
                <IonButton
                  expand="block"
                  fill="clear"
                  onClick={handleSendAgainVerification}
                >
                  {textAuthContext[l].btn_sendVerifyAgain}
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>
      ) : null}
    </AuthContext.Provider>
  );
};
