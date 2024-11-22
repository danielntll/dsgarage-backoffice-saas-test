import { useContext } from "react";
import styles from "./ImageCard.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { IonCard, IonCardContent, IonLabel } from "@ionic/react";
import { typeImage } from "../../types/typeImage";
import { useGalleryContext } from "../../context/gallery/contextGallery";
import ImageButtonPin from "../Image__Button__Pin/ImageButtonPin";
import ImageButtonVisibility from "../Image__Button__Visibility/ImageButtonVisibility";
import ImageButtonModify from "../Image__Button__Modify/ImageButtonModify";
import ImageButtonDelete from "../Image__Button__Delete/ImageButtonDelete";

interface ContainerProps {
  image: typeImage;
}

const ImageCard: React.FC<ContainerProps> = ({ image }) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { handleShowImageOverlay } = useGalleryContext();
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <IonCard className={styles.card}>
      <img
        onClick={() => handleShowImageOverlay(image)}
        className={styles.image}
        src={image.imageUrl}
        alt={image.alt}
      />
      <IonCardContent>
        <IonLabel>
          <h2>Nome: {image.name}</h2>
          <h3>Alt: {image.alt}</h3>
        </IonLabel>
      </IonCardContent>
      <div className={"ion-padding"}>
        <div>
          <ImageButtonPin image={image} />
          <ImageButtonVisibility image={image} />
        </div>

        <div className={styles.buttons}>
          <ImageButtonModify image={image} />
          <ImageButtonDelete image={image} />
        </div>
      </div>
    </IonCard>
  );
};

export default ImageCard;
