import { useContext, useEffect, useState } from "react";
import styles from "./ImageOverlay.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { typeImage } from "../../types/typeImage";
import { useGalleryContext } from "../../context/gallery/contextGallery";
import { IonButton, IonButtons, IonIcon } from "@ionic/react";
import { eye, eyeOffOutline, star, starOutline } from "ionicons/icons";

interface ContainerProps {
  showOverlay: boolean;
  overlayImage: typeImage | null;
  closeOverlay: () => void;
}

const ImageOverlay: React.FC<ContainerProps> = ({
  showOverlay,
  overlayImage,
  closeOverlay,
}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const {
    togglePinImage,
    toggleVisibilityImage,
    handleEditClick,
    galleryData,
  } = useGalleryContext();

  //CONDITIONS -----------------------
  const [image, setImage] = useState<typeImage | null>(overlayImage);
  //FUNCTIONS ------------------------
  useEffect(() => {
    if (overlayImage) {
      setImage(galleryData.filter((item) => item.uid === overlayImage.uid)[0]);
    }
  }, [galleryData]);
  //RETURN COMPONENT -----------------
  if (!overlayImage) return null; // Handle the case where overlayImage is null

  return (
    <div className={styles.container}>
      {showOverlay && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            {/* Immagine */}
            <img
              src={image!.imageUrl}
              alt="Overlay"
              style={{ maxWidth: "90vw", maxHeight: "90vh" }}
            />
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className={styles.actions}>
        {" "}
        {/* Add a container for buttons */}
        <IonButtons>
          <IonButton
            fill={"outline"}
            onClick={closeOverlay}
            size="small"
            color={"medium"}
          >
            Chiudi immagine
          </IonButton>
        </IonButtons>
        <IonButtons>
          <IonButton
            className="ion-padding-start"
            fill={image!.isPinned ? "solid" : "outline"}
            onClick={() => togglePinImage(image!)}
            size="small"
          >
            <IonIcon icon={image!.isPinned ? star : starOutline} />
            {!image!.isPinned ? "Metti in evidenza" : "Togli evidenza"}
          </IonButton>
          <IonButton
            fill={image!.isVisible ? "solid" : "outline"}
            color={"tertiary"}
            onClick={() => toggleVisibilityImage(image!)}
            size="small"
          >
            <IonIcon icon={image!.isVisible ? eye : eyeOffOutline} />
            {!image!.isVisible ? "Visualizza" : "Nascondi"}
          </IonButton>
          <IonButton
            onClick={() => {
              handleEditClick(image!);
              closeOverlay();
            }} // Close overlay after edit click
            fill="clear"
            size="small"
          >
            Modifica
          </IonButton>
        </IonButtons>
      </div>
    </div>
  );
};

export default ImageOverlay;
