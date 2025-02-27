import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import styles from "./HomePage.module.css";
import { useContext, useEffect, useState } from "react";
import { ContextLanguage } from "../../context/contextLanguage";
import { useLocation } from "react-router";
import { appRoutes, homeRoutes } from "../../routes/routes";
import { typeRoute } from "../../types/typeRoute";
import { typeImage } from "../../types/typeImage";

interface PageProps {}

const HomePage: React.FC<PageProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const location = useLocation();
  //CONDITIONS -----------------------
  const [pageName, setPageName] = useState<string | undefined>("");

  useEffect(() => {
    setPageName(
      appRoutes.find((route: typeRoute) => route.path === location.pathname)
        ?.tab[l]
    );
  }, [location]);

  const [selectedImages, setSelectedImages] = useState<typeImage[]>([]);
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
        <div className="ion-padding">
          {homeRoutes.map((route: typeRoute, index: number) => {
            return (
              <div key={index + route.path}>
                <IonButton
                  fill="outline"
                  expand="block"
                  routerLink={route.path}
                >
                  <IonIcon
                    className="ion-margin-end"
                    icon={route.icons.notActive}
                  />
                  {route.tab[l]}
                </IonButton>
                <IonLabel>
                  <p>{route.description}</p>
                </IonLabel>
                <br />
              </div>
            );
          })}
        </div>
        {/* ----------------- EXTRA UI ----------------------*/}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
