import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { text } from "./text";

import styles from "./ServicesPage.module.css";
import { useContext } from "react";
import { ContextLanguage } from "../../context/contextLanguage";
import { route_ServicesPage } from "../../routes/singleRoute";
import ServicesAll from "../../components/Services__All/ServicesAll";
import { ServicesContextProvider } from "../../context/services/contextServices";

interface PageProps {}

const ServicesPage: React.FC<PageProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <ServicesContextProvider>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{route_ServicesPage.tab[l]}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{route_ServicesPage.tab[l]}</IonTitle>
            </IonToolbar>
          </IonHeader>
          {/* ----------------- PAGE CONTENT ------------------*/}
          <div className={styles.content + " ion-padding"}>
            <ServicesAll />
          </div>
          {/* ----------------- EXTRA UI ----------------------*/}
        </IonContent>
      </IonPage>
    </ServicesContextProvider>
  );
};

export default ServicesPage;
