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

import styles from "./PromotionsPage.module.css";
import { useContext } from "react";
import { ContextLanguage } from "../../context/contextLanguage";
import PromotionsActive from "../../components/Promotions__Active/PromotionsActive";
import PromotionsAll from "../../components/Promotions__All/PromotionsAll";

interface PageProps {}

const PromotionsPage: React.FC<PageProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{text[l].pageTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{text[l].pageTitle}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {/* ----------------- PAGE CONTENT ------------------*/}
        <div className={styles.content + " ion-padding"}>
          <PromotionsActive />
          <PromotionsAll />
        </div>
        {/* ----------------- EXTRA UI ----------------------*/}
      </IonContent>
    </IonPage>
  );
};

export default PromotionsPage;
