import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { text } from "./text";

import styles from "./PromotionsPage.module.css";
import { useContext, useState } from "react";
import { ContextLanguage } from "../../context/contextLanguage";
import PromotionsActive from "../../components/Promotions__Active/PromotionsActive";
import PromotionsAll from "../../components/Promotions__All/PromotionsAll";
import { PromotionsContextProvider } from "../../context/promotions/contextPromotions";
import PromotionButtonNew from "../../components/Promotion__Button__New/PromotionButtonNew";
import { ServicesContextProvider } from "../../context/services/contextServices";

interface PageProps {}

const PromotionsPage: React.FC<PageProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  //CONDITIONS -----------------------
  const [searchTerm, setSearchTerm] = useState<string>("");
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <PromotionsContextProvider>
      <ServicesContextProvider>
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle>{text[l].pageTitle}</IonTitle>
              <IonButtons slot="end">
                <PromotionButtonNew />
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
            <IonHeader collapse="condense">
              <IonToolbar>
                <IonTitle size="large">{text[l].pageTitle}</IonTitle>
              </IonToolbar>
              <IonToolbar>
                <IonSearchbar
                  placeholder={text[l].placeholder__search}
                  value={searchTerm}
                  onIonInput={(e) => setSearchTerm(e.detail.value!)}
                />
              </IonToolbar>
            </IonHeader>
            {/* ----------------- PAGE CONTENT ------------------*/}
            <div className={styles.content + " ion-padding"}>
              <PromotionsActive />
              <PromotionsAll searchTerm={searchTerm} />
            </div>
            {/* ----------------- EXTRA UI ----------------------*/}
          </IonContent>
        </IonPage>
      </ServicesContextProvider>
    </PromotionsContextProvider>
  );
};

export default PromotionsPage;
