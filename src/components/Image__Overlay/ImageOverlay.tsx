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
            <img
              src={overlayImage.imageUrl}
              alt="Overlay"
              style={{ maxWidth: "90vw", maxHeight: "90vh" }}
            />

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
                <IonButton
                  className="ion-padding-start"
                  fill={overlayImage.isPinned ? "solid" : "outline"}
                  onClick={() => togglePinImage(overlayImage)}
                  size="small"
                >
                  <IonIcon icon={overlayImage.isPinned ? star : starOutline} />
                  {!overlayImage.isPinned
                    ? "Metti in evidenza"
                    : "Togli evidenza"}
                </IonButton>
                <IonButton
                  fill={overlayImage.isVisible ? "solid" : "outline"}
                  color={"tertiary"}
                  onClick={() => toggleVisibilityImage(overlayImage)}
                  size="small"
                >
                  <IonIcon
                    icon={overlayImage.isVisible ? eye : eyeOffOutline}
                  />
                  {!overlayImage.isVisible ? "Visualizza" : "Nascondi"}
                </IonButton>
                <IonButton
                  onClick={() => {
                    handleEditClick(overlayImage);
                    closeOverlay();
                  }} // Close overlay after edit click
                  fill="clear"
                  size="small"
                >
                  Edit
                </IonButton>
              </IonButtons>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageOverlay;
