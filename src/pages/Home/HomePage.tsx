import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import styles from "./HomePage.module.css";
import { useContext, useEffect, useState } from "react";
import { ContextLanguage } from "../../context/contextLanguage";
import { useLocation } from "react-router";
import { appRoutes } from "../../routes/routes";
import { typeRoute } from "../../types/typeRoute";

interface PageProps {}

const HomePage: React.FC<PageProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const location = useLocation();
  //CONDITIONS -----------------------
  const [isModalNotificationsOpen, setIsModalNotificationsOpen] =
    useState<boolean>(false);
  const [isModalOrderComponentsOpen, setIsModalOrderComponentsOpen] =
    useState<boolean>(false);
  const [pageName, setPageName] = useState<string | undefined>("");

  useEffect(() => {
    setPageName(
      appRoutes.find((route: typeRoute) => route.path === location.pathname)
        ?.tab[l]
    );
  }, [location]);
  //FUNCTIONS ------------------------

  //RETURN COMPONENT -----------------
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{pageName}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{pageName}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* ----------------- PAGE CONTENT ------------------*/}

        {/* ----------------- EXTRA UI ----------------------*/}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
