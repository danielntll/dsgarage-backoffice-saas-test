import { useContextLanguage } from "../../context/contextLanguage";
import { useGalleryContext } from "../../context/gallery/contextGallery";
import { text } from "./text";
import { IonButton, IonIcon, IonSpinner } from "@ionic/react";
import { downloadOutline } from "ionicons/icons";
interface ContainerProps {}

const GalleryButtonLoadMore: React.FC<ContainerProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  const { isLoadingMore, loadMoreData, lastVisible } = useGalleryContext();
  //USE STATES -----------------------
  //USE EFFECTS ----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <IonButton
      onClick={loadMoreData}
      className="ion-padding-horizontal"
      expand="block"
      fill="outline"
      disabled={lastVisible === undefined ? true : false}
    >
      {lastVisible === undefined ? (
        text[l].no_more_data
      ) : (
        <>
          {isLoadingMore === true ? text[l].loading : text[l].load_more}
          {isLoadingMore === true ? (
            <IonSpinner />
          ) : (
            <IonIcon className="ion-margin-start" icon={downloadOutline} />
          )}
        </>
      )}
    </IonButton>
  );
};

export default GalleryButtonLoadMore;
