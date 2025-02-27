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

import styles from "./ServicesPage.module.css";
import { useContext, useState } from "react";
import { ContextLanguage } from "../../context/contextLanguage";
import { route_ServicesPage } from "../../routes/singleRoute";
import { ServicesContextProvider } from "../../context/services/contextServices";
import ServicesButtonCreate from "../../components/Services__Button__Create/ServicesButtonCreate";
import { enumServices } from "../../enum/enumServices";
import ServicesList from "../../components/Services__List/ServicesList";

interface PageProps {}

const ServicesPage: React.FC<PageProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  //CONDITIONS -----------------------
  const [segment, setSegment] = useState<enumServices>(enumServices.all);
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
            <IonButtons slot="end">
              <ServicesButtonCreate />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{route_ServicesPage.tab[l]}</IonTitle>
            </IonToolbar>
            {/* -------- */}
            <IonToolbar>
              <IonSegment
                value={segment}
                onIonChange={(e) => setSegment(e.detail.value as enumServices)}
              >
                <IonSegmentButton value={enumServices.all}>
                  <IonLabel>{text[l].segment__all}</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value={enumServices.pinned}>
                  <IonLabel>{text[l].segment__pinned}</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value={enumServices.archived}>
                  <IonLabel>{text[l].segment__archived}</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </IonToolbar>
          </IonHeader>
          {/* ----------------- PAGE CONTENT ------------------*/}
          <div className={styles.content + " ion-padding"}>
            <ServicesList searchTerm={""} filter={segment} />
          </div>
          {/* ----------------- EXTRA UI ----------------------*/}
        </IonContent>
      </IonPage>
    </ServicesContextProvider>
  );
};

export default ServicesPage;
