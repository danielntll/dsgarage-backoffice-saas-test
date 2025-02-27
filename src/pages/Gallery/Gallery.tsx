import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
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

import styles from "./Gallery.module.css";
import { useContext, useState } from "react";
import { ContextLanguage } from "../../context/contextLanguage";
import { route_GalleryPage } from "../../routes/singleRoute";
import ModalImagesUpload from "../../components/Modal__Images__Upload/ModalImagesUpload";
import { enumPageGallerySegment } from "../../enum/enumPageGallerySegment";
import GalleryList from "../../components/Gallery__List/GalleryList";
import { add } from "ionicons/icons";

interface PageProps {}

const GalleryPage: React.FC<PageProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);

  //CONDITIONS -----------------------
  const [isModalUploadOpen, setIsModalUploadOpen] = useState<boolean>(false);
  const [segment, setSegment] = useState<enumPageGallerySegment>(
    enumPageGallerySegment.all
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  //FUNCTIONS ------------------------

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
              <IonIcon icon={add} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* ----- */}
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{route_GalleryPage.tab[l]}</IonTitle>
          </IonToolbar>
          {/* -------- */}
          <IonToolbar>
            <IonSearchbar
              placeholder="Cerca immagine"
              value={searchTerm}
              onIonInput={(e) => setSearchTerm(e.detail.value!)}
            />
          </IonToolbar>
          {/* -------- */}
          <IonToolbar>
            <IonSegment
              value={segment}
              onIonChange={(e) =>
                setSegment(e.detail.value as enumPageGallerySegment)
              }
            >
              <IonSegmentButton value={enumPageGallerySegment.all}>
                <IonLabel>{text[l].segment.all}</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value={enumPageGallerySegment.pinned}>
                <IonLabel>{text[l].segment.pinned}</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value={enumPageGallerySegment.archived}>
                <IonLabel>{text[l].segment.archived}</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonToolbar>
        </IonHeader>
        {/* ----------------- PAGE CONTENT ------------------*/}
        <div className={styles.content}>
          <GalleryList searchTerm={searchTerm} filter={segment} />
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
