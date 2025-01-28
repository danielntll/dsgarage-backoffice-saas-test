import { useContext, useState } from "react";
import styles from "./ModalImagesUpload.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { typeImageToUpload } from "../../types/typeImageToUpload";
import { useGalleryContext } from "../../context/gallery/contextGallery";
import ImagesAdd from "../Images__Add/ImagesAdd";
import { typeImageUploadData } from "../../types/typeImageUploadData";

interface ContainerProps {
  isModalOpen: boolean;
  setIsModalOpen: (state: boolean) => void;
}

const ModalImagesUpload: React.FC<ContainerProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { handleUploadImages } = useGalleryContext();
  //CONDITIONS -----------------------
  const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);
  const [imageDetails, setImageDetails] = useState<typeImageUploadData>({});

  //FUNCTIONS ------------------------
  const handleImagesUpload = async () => {
    if (imagesToUpload.length === 0) return;
    handleUploadImages(imagesToUpload, imageDetails).then(
      (uploadSuccessful) => {
        // Use the returned value
        if (uploadSuccessful) {
          // Check if upload was successful
          imagesToUpload.forEach((image) =>
            URL.revokeObjectURL(URL.createObjectURL(image))
          );
          setIsModalOpen(false);
          setImagesToUpload([]);
          setImageDetails({});
        }
      }
    );
  };
  //RETURN COMPONENT -----------------

  return (
    <IonModal isOpen={isModalOpen}>
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonButton
              slot="start"
              onClick={() => {
                setIsModalOpen(false);
                setImagesToUpload([]);
              }}
              color="medium"
            >
              {text[l].closeButton}
            </IonButton>
          </IonButtons>
          <IonTitle>{text[l].componentTitle}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => handleImagesUpload()}
              disabled={imagesToUpload.length === 0}
            >
              {" "}
              {/* Disable if no images */}
              {text[l].uploadButton}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <ImagesAdd
          selectedFiles={imagesToUpload}
          setSelectedFiles={setImagesToUpload}
          imageDetails={imageDetails}
          setImageDetails={setImageDetails}
        />
      </IonContent>
    </IonModal>
  );
};

export default ModalImagesUpload;
