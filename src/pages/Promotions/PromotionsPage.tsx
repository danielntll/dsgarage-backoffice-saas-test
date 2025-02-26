import {
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { text } from "./text";

import styles from "./PromotionsPage.module.css";
import { useContext, useState } from "react";
import { ContextLanguage } from "../../context/contextLanguage";
import PromotionsAll from "../../components/Promotions__All/PromotionsAll";
import { PromotionsContextProvider } from "../../context/promotions/contextPromotions";
import PromotionButtonNew from "../../components/Promotion__Button__New/PromotionButtonNew";
import { ServicesContextProvider } from "../../context/services/contextServices";
import { enumPromotions } from "../../enum/enumPromotions";
import PromotionsList from "../../components/Promotions__List/PromotionsList";

interface PageProps {}

const PromotionsPage: React.FC<PageProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  //CONDITIONS -----------------------
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [segment, setSegment] = useState<enumPromotions>(enumPromotions.all);
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <ServicesContextProvider>
      <PromotionsContextProvider>
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
              {/* -------- */}
              <IonToolbar>
                <IonSegment
                  value={segment}
                  onIonChange={(e) =>
                    setSegment(e.detail.value as enumPromotions)
                  }
                >
                  <IonSegmentButton value={enumPromotions.all}>
                    <IonLabel>{text[l].segment__all}</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value={enumPromotions.pinned}>
                    <IonLabel>{text[l].segment__pinned}</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value={enumPromotions.inProgress}>
                    <IonLabel>{text[l].segment__inProgress}</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value={enumPromotions.notStarted}>
                    <IonLabel>{text[l].segment__notStarted}</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value={enumPromotions.expired}>
                    <IonLabel>{text[l].segment__expired}</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value={enumPromotions.archived}>
                    <IonLabel>{text[l].segment__archived}</IonLabel>
                  </IonSegmentButton>
                </IonSegment>
              </IonToolbar>
            </IonHeader>
            {/* ----------------- PAGE CONTENT ------------------*/}
            <div className={styles.content + " ion-padding"}>
              <PromotionsList filter={segment} searchTerm={searchTerm} />
            </div>
            {/* ----------------- EXTRA UI ----------------------*/}
          </IonContent>
        </IonPage>
      </PromotionsContextProvider>
    </ServicesContextProvider>
  );
};

export default PromotionsPage;
