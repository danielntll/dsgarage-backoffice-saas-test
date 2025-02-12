import styles from "./ImagesAll.module.css";
import { useContext, useEffect } from "react";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { IonButton, IonIcon } from "@ionic/react";
import { useGalleryContext } from "../../context/gallery/contextGallery";
import { downloadOutline } from "ionicons/icons";
import { enumPageGallerySegment } from "../../enum/enumPageGallerySegment";
import DataDisplay from "../Data__Display/DataDisplay";

interface ContainerProps {
  searchTerm: string;
  filter: enumPageGallerySegment;
}

const ImagesAll: React.FC<ContainerProps> = ({ searchTerm, filter }) => {
  // VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  // const { initState, galleryData, loading, error, loadMoreData } =
  //   useGalleryContext();

  // USE STATES -----------------------
  // USE EFFECTS----------------------
  // useEffect(() => {
  //   initState();
  // }, []);
  // FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <>
      {/* <DataDisplay event="" data={galleryData} type={"image"} /> */}
      <div className="ion-padding-horizontal">
        {/* <IonButton onClick={loadMoreData} disabled={loading} expand="block">
          <IonIcon icon={downloadOutline} className="ion-margin-end" />
          {loading ? text[l].loading__images : text[l].btn__load__more}
        </IonButton> */}
      </div>
    </>
  );
};

export default ImagesAll;
