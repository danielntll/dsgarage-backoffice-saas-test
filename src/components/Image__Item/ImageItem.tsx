import { useContext, useState } from "react";
import styles from "./ImageItem.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import {
  IonIcon,
  IonItem,
  IonLabel,
  IonPopover,
  IonThumbnail,
  IonContent,
  IonList,
  IonButton,
} from "@ionic/react";
import { typeImage } from "../../types/typeImage";
import {
  archive,
  archiveOutline,
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
    handleShowImageOverlay,
    handleDeleteImage,
    handleEditImage,
    handleToggleArchiveImage,
    handleTogglePinImage,
  } = useGalleryContext();
  //CONDITIONS -----------------------
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [popoverEvent, setPopoverEvent] = useState<any>(null);
  //FUNCTIONS ------------------------
  const handleOptionsClick = (e: any) => {
    e.persist();
    setPopoverEvent(e);
    setIsOpen(true);
  };

  //RETURN COMPONENT -----------------
  return (
    <>
      <IonItem button onClick={() => handleShowImageOverlay(image)}>
        <IonThumbnail className="ion-margin-end">
          <img src={image.imageUrl} alt={image.alt} />
        </IonThumbnail>
        <IonLabel>
          <h2>{image.name}</h2>
          <p>{image.alt}</p>
        </IonLabel>
        <IonButton fill="clear" onClick={handleOptionsClick}>
          <IonIcon icon={pencil} />
        </IonButton>
      </IonItem>
      {/* ------- */}
      <IonPopover
        isOpen={isOpen}
        event={popoverEvent}
        dismissOnSelect={true}
        onDidDismiss={() => setIsOpen(false)}
      >
        <IonContent>
          <IonList>
            <IonItem
              button
              onClick={() => handleDeleteImage(image)}
              color="danger"
            >
              <IonIcon icon={trashBinOutline} slot="icon-only" /> Elimina
            </IonItem>
            <IonItem button onClick={() => handleTogglePinImage(image)}>
              <IonIcon
                icon={image.isPinned ? star : starHalf}
                slot="icon-only"
              />
              {image.isPinned
                ? "Rimuovi dai preferiti"
                : "Aggiungi ai preferiti"}
            </IonItem>
            <IonItem button onClick={() => handleToggleArchiveImage(image)}>
              <IonIcon
                icon={image.isArchived ? archive : archiveOutline}
                slot="icon-only"
              />
              {image.isArchived ? "Nascondi" : "Mostra"}
            </IonItem>
            <IonItem button onClick={() => handleEditImage(image)}>
              <IonIcon icon={pencil} slot="icon-only" /> Modifica
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>
    </>
  );
};

export default ImageItem;
