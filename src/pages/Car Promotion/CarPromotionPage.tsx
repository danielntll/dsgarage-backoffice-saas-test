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
import { CarPromotionContextProvider } from "../../context/car promotion/contextCarPromotion";
import CarPromotionList from "../../components/CarPromotion__List/CarPromotionList";
import { enumCarPromotionSegments } from "../../enum/enumCarPromotionSegments";

interface PageProps {}

const CarPromotionPage: React.FC<PageProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  //CONDITIONS -----------------------
  const [segment, setSegment] = useState<enumCarPromotionSegments>(
    enumCarPromotionSegments.all
  );
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
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
              onIonChange={(e) =>
                setSegment(e.detail.value as enumCarPromotionSegments)
              }
            >
              <IonSegmentButton value={enumCarPromotionSegments.all}>
                <IonLabel>{text[l].segment__all}</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value={enumCarPromotionSegments.pinned}>
                <IonLabel>{text[l].segment__pinned}</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value={enumCarPromotionSegments.archived}>
                <IonLabel>{text[l].segment__archived}</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>
        </IonHeader>
        {/* ----------------- PAGE CONTENT ------------------*/}
        <div className={styles.content + " ion-padding"}>
          <CarPromotionList filter={segment} />
        </div>
        {/* ----------------- EXTRA UI ----------------------*/}
      </IonContent>
    </IonPage>
  );
};

export default CarPromotionPage;
