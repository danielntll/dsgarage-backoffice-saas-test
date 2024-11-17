import { ToastOptions, useIonToast } from "@ionic/react";
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
};

export const ContextToast = createContext<typeContextToast>({
  toast: () => {
    console.log("toast");
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
  // Return ---------------------------
  return (
    <ContextToast.Provider value={{ toast }}>{children}</ContextToast.Provider>
  );
};
