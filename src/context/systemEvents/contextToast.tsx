import { ToastOptions, useIonLoading, useIonToast } from "@ionic/react";
import React, { createContext, useContext } from "react";
import { closeOutline } from "ionicons/icons";

type typeContextToast = {
  toast: (
    type: "success" | "warning" | "danger" | "medium",
    message: string,
    duration?: number,
    button?: ToastOptions["buttons"],
    position?: "top" | "bottom"
  ) => void;
  loadingAlert: (message: string, duration?: number) => void;
  dismissLoadingAlert: () => void;
};

export const ContextToast = createContext<typeContextToast>({
  toast: () => {
    console.log("toast");
  },
  loadingAlert: () => {
    console.log("loading");
  },
  dismissLoadingAlert: () => {
    console.log("dismissLoading");
  },
});

export const useContextToast = () => useContext(ContextToast);

export const ProviderContextToast = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Variables ------------------------
  const [present] = useIonToast();
  const [presentLoadingAlert, dismissLoadingAlert] = useIonLoading();
  // UseStates ------------------------
  // UseEffects -----------------------
  // Functions ------------------------
  const toast = (
    type: "success" | "warning" | "danger" | "medium",
    message: string,
    duration?: number,
    button?: ToastOptions["buttons"],
    position?: "top" | "bottom"
  ) => {
    present({
      message: message,
      duration: duration ? duration : 1500,
      color: type,
      position: position ?? "top",
      swipeGesture: "vertical",
      buttons: [
        {
          icon: `${closeOutline}`,
          role: "close",
        },
        ...(button ? button : []),
      ],
    });
  };

  const loadingAlert = (message: string, duration?: number) => {
    presentLoadingAlert({
      message: message,
      duration: duration ? duration : 1500,
    });
  };
  // Return ---------------------------
  return (
    <ContextToast.Provider value={{ toast, loadingAlert, dismissLoadingAlert }}>
      {children}
    </ContextToast.Provider>
  );
};
