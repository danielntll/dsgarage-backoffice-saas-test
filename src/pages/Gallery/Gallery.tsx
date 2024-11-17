import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { text } from "./text";

import styles from "./Gallery.module.css";
import { useContext, useState } from "react";
import { ContextLanguage } from "../../context/contextLanguage";
import { route_GalleryPage } from "../../routes/singleRoute";
import PinnedImages from "../../components/PinnedImages/PinnedImages";
import { GalleryContextProvider } from "../../context/contextGallery";
import ImagesAll from "../../components/Images__All/ImagesAll";

interface PageProps {}

const GalleryPage: React.FC<PageProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <GalleryContextProvider>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{route_GalleryPage.tab[l]}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{route_GalleryPage.tab[l]}</IonTitle>
            </IonToolbar>
          </IonHeader>
          {/* ----------------- PAGE CONTENT ------------------*/}
          <div className={styles.content}>
            <PinnedImages />
            <ImagesAll />
          </div>
          {/* ----------------- EXTRA UI ----------------------*/}
        </IonContent>
      </IonPage>
    </GalleryContextProvider>
  );
};

export default GalleryPage;
