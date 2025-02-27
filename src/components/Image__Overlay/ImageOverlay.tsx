import { useContext, useEffect, useState } from "react";
import styles from "./ImageOverlay.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { typeImage } from "../../types/typeImage";
import { useGalleryContext } from "../../context/gallery/contextGallery";
import { IonButton, IonButtons } from "@ionic/react";
import ImageButtonPin from "../Image__Button__Pin/ImageButtonPin";
import ImageButtonVisibility from "../Image__Button__Visibility/ImageButtonVisibility";
import ImageButtonModify from "../Image__Button__Modify/ImageButtonModify";

interface ContainerProps {
  showOverlay: boolean;
  overlayImage: typeImage | null;
  callbackCloseOverlay: () => void;
}

const ImageOverlay: React.FC<ContainerProps> = ({
  showOverlay,
  overlayImage,
  callbackCloseOverlay,
}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { galleryData } = useGalleryContext();

  //CONDITIONS -----------------------
  const [image, setImage] = useState<typeImage | null>(overlayImage);
  //FUNCTIONS ------------------------
  useEffect(() => {
    if (overlayImage && galleryData) {
      setImage(galleryData.filter((item) => item.uid === overlayImage.uid)[0]);
    }
  }, [galleryData]);
  //RETURN COMPONENT -----------------
  if (!overlayImage) return null; // Handle the case where overlayImage is null

  return (
    <div className={styles.container}>
      {/* Action Buttons */}
      <div className={styles.actions}>
        {/* Add a container for buttons */}
        <IonButtons>
          <IonButton
            fill={"clear"}
            onClick={callbackCloseOverlay}
            size="small"
            color={"primary"}
          >
            Chiudi
          </IonButton>
        </IonButtons>
        <IonButtons>
          <ImageButtonPin image={image} />
          <ImageButtonVisibility image={image} />
        </IonButtons>
        <IonButtons>
          <ImageButtonModify fill="outline" image={image} />
        </IonButtons>
      </div>
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
    </div>
  );
};

export default ImageOverlay;
