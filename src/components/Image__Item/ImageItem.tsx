import { useContext } from "react";
import styles from "./ImageItem.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import {
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonThumbnail,
} from "@ionic/react";
import { typeImage } from "../../types/typeImage";
import {
  eye,
  eyeOff,
  pencil,
  star,
  starHalf,
  trashBinOutline,
} from "ionicons/icons";
import { useGalleryContext } from "../../context/gallery/contextGallery";

interface ContainerProps {
  image: typeImage;
}

const ImageItem: React.FC<ContainerProps> = ({ image }) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const {
    galleryData,
    loading,
    error,
    handleShowImageOverlay,
    handleDeleteImage,
    handleEditClick,
    togglePinImage,
    toggleVisibilityImage,
  } = useGalleryContext();
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <IonItemSliding>
      {/* ----------- ACTIONS START ------- */}
      <IonItemOptions side="start">
        <IonItemOption
          color="danger"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteImage(image);
          }}
        >
          <IonIcon icon={trashBinOutline} slot="icon-only" />
        </IonItemOption>
      </IonItemOptions>
      {/* ----------- ITEM ------- */}
      <IonItem
        button
        onClick={() => {
          handleShowImageOverlay(image);
        }}
      >
        <IonThumbnail className="ion-margin-end">
          <img src={image.imageUrl} alt={image.alt} />
        </IonThumbnail>
        <IonLabel>
          <h2>{image.name}</h2>
          <p>{image.alt}</p>
        </IonLabel>
      </IonItem>
      {/* ----------- ACTIONS END ------- */}
      <IonItemOptions side="end">
        <IonItemOption
          color={image.isPinned ? "primary" : "medium"}
          onClick={(e) => {
            e.stopPropagation();
            togglePinImage(image);
          }}
        >
          <IonIcon icon={image.isPinned ? star : starHalf} slot="icon-only" />
        </IonItemOption>
        <IonItemOption
          color={image.isVisible ? "primary" : "medium"}
          onClick={(e) => {
            e.stopPropagation();
            toggleVisibilityImage(image);
          }}
        >
          <IonIcon icon={image.isVisible ? eye : eyeOff} slot="icon-only" />
        </IonItemOption>
        <IonItemOption
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            handleEditClick(image);
          }}
        >
          <IonIcon icon={pencil} slot="icon-only" />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default ImageItem;
