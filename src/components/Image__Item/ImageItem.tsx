import { useContext, useState } from "react";
import { ContextLanguage } from "../../context/contextLanguage";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonThumbnail,
} from "@ionic/react";
import { typeImage } from "../../types/typeImage";
import { ellipsisVertical, star } from "ionicons/icons";
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
    handleEditClick,
    togglePinImage,
    toggleVisibilityImage,
  } = useGalleryContext();
  //CONDITIONS -----------------------
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [popoverEvent, setPopoverEvent] = useState<any>(null);

  //FUNCTIONS ------------------------
  const handleOptionsClick = (e: any) => {
    e.stopPropagation();
    e.persist();
    setPopoverEvent(e);
    setIsOpen(true);
  };
  //RETURN COMPONENT -----------------
  return (
    <>
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
          <h2>
            {image.isPinned && <IonIcon color="primary" icon={star} />} Alt:{" "}
            {image.alt}
          </h2>
          <p>
            Descrizione:{" "}
            {image.description?.length === 0
              ? "Nessuna descrizione"
              : image.description}
          </p>
          <p>Nome: {image.name}</p>
        </IonLabel>
        <IonButton fill="clear" onClick={handleOptionsClick}>
          <IonIcon icon={ellipsisVertical} />
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
              onClick={() => handleEditClick(image)}
              button={true}
              detail={false}
            >
              Modifica
            </IonItem>
            <IonItem
              onClick={() => togglePinImage(image)}
              button={true}
              detail={false}
            >
              Preferiti
            </IonItem>
            <IonItem
              onClick={() => toggleVisibilityImage(image)}
              button={true}
              detail={false}
            >
              Archivia
            </IonItem>
            <IonItem
              onClick={() => handleDeleteImage(image)}
              color={"danger"}
              button={true}
              detail={false}
            >
              Elimina
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>
    </>
  );
};

export default ImageItem;
