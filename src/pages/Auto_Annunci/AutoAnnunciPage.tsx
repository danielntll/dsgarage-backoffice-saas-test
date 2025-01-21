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

import styles from "./AutoAnnunciPage.module.css";
import { useContext } from "react";
import { ContextLanguage } from "../../context/contextLanguage";
import { route_AutoAnnunci } from "../../routes/singleRoute";
import AutoButtonCreate from "../../components/Auto__Button__Create/AutoButtonCreate";
import { AutoAnnunciContextProvider } from "../../context/autoPromotions/contextAutoPromotions";

interface PageProps {}

const AutoAnnunciPage: React.FC<PageProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <AutoAnnunciContextProvider>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{route_AutoAnnunci.tab[l]}</IonTitle>
            <IonButtons slot="end">
              <AutoButtonCreate />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{route_AutoAnnunci.tab[l]}</IonTitle>
            </IonToolbar>
          </IonHeader>
          {/* ----------------- PAGE CONTENT ------------------*/}
          <div className={styles.content + " ion-padding"}></div>
          {/* ----------------- EXTRA UI ----------------------*/}
        </IonContent>
      </IonPage>
    </AutoAnnunciContextProvider>
  );
};

export default AutoAnnunciPage;
