import {
  IonButton,
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

import styles from "./Gallery.module.css";
import { useContext, useEffect, useState } from "react";
import { ContextLanguage } from "../../context/contextLanguage";
import { route_GalleryPage } from "../../routes/singleRoute";
import PinnedImages from "../../components/PinnedImages/PinnedImages";
import {
  GalleryContextProvider,
  useGalleryContext,
} from "../../context/gallery/contextGallery";
import ImagesAll from "../../components/Images__All/ImagesAll";
import ModalImagesUpload from "../../components/Modal__Images__Upload/ModalImagesUpload";

interface PageProps {}

const GalleryPage: React.FC<PageProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { initState } = useGalleryContext();
  //CONDITIONS -----------------------
  const [isModalUploadOpen, setIsModalUploadOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  //FUNCTIONS ------------------------
  useEffect(() => {
    initState();
  }, []);
  //RETURN COMPONENT -----------------
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{route_GalleryPage.tab[l]}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => setIsModalUploadOpen(true)}
              color={"primary"}
            >
              {text[l].uploadImages}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{route_GalleryPage.tab[l]}</IonTitle>
          </IonToolbar>
          <IonToolbar>
            <IonSearchbar
              placeholder="Cerca immagine"
              value={searchTerm}
              onIonInput={(e) => setSearchTerm(e.detail.value!)}
            />
          </IonToolbar>
        </IonHeader>
        {/* ----------------- PAGE CONTENT ------------------*/}
        <div className={styles.content}>
          <PinnedImages />
          <ImagesAll searchTerm={searchTerm} />
        </div>
        {/* ----------------- EXTRA UI ----------------------*/}
        <ModalImagesUpload
          isModalOpen={isModalUploadOpen}
          setIsModalOpen={setIsModalUploadOpen}
        />
      </IonContent>
    </IonPage>
  );
};

export default GalleryPage;
