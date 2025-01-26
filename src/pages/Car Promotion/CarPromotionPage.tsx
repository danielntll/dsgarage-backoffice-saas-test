import {
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { text } from "./text";

import styles from "./CarPromotionPage.module.css";
import { useContext, useState } from "react";
import { ContextLanguage } from "../../context/contextLanguage";
import { route_CarPromotionPage } from "../../routes/singleRoute";
import AutoButtonCreate from "../../components/CarPromotion__Button__Create/CarPromotionButtonCreate";

import { typeSegment } from "../../types/typeSegment";
import { CarPromotionContextProvider } from "../../context/car promotion/contextCarPromotion";
import CarPromotionList from "../../components/CarPromotion__List/CarPromotionList";

interface PageProps {}

const CarPromotionPage: React.FC<PageProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  //CONDITIONS -----------------------
  const [segment, setSegment] = useState<typeSegment>("active");
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <CarPromotionContextProvider>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{route_CarPromotionPage.tab[l]}</IonTitle>
            <IonButtons slot="end">
              <AutoButtonCreate />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{route_CarPromotionPage.tab[l]}</IonTitle>
            </IonToolbar>
            {/* -------- */}
            <IonToolbar>
              <IonSegment
                value={segment}
                onIonChange={(e) => setSegment(e.detail.value as typeSegment)}
              >
                <IonSegmentButton value="active">
                  <IonLabel>{text[l].segment__active}</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="archived">
                  <IonLabel>{text[l].segment__archived}</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </IonToolbar>
          </IonHeader>
          {/* ----------------- PAGE CONTENT ------------------*/}
          <div className={styles.content + " ion-padding"}>
            <CarPromotionList />
          </div>
          {/* ----------------- EXTRA UI ----------------------*/}
        </IonContent>
      </IonPage>
    </CarPromotionContextProvider>
  );
};

export default CarPromotionPage;
