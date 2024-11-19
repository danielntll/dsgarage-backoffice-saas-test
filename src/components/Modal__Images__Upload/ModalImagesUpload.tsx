import { useContext, useEffect, useState } from 'react';
import styles from './ModalImagesUpload.module.css';
import { ContextLanguage } from '../../context/contextLanguage';
import { text } from './text';
import { IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonModal, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import { useGalleryContext } from '../../context/contextGallery';

interface ContainerProps {
  isModalOpen: boolean;
  setIsModalOpen: (state: boolean) => void
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
  //FUNCTIONS ------------------------
  const handleSelectImages = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";

    input.onchange = async (e: any) => {
      if (e.target?.files) {
        const files = Array.from(e.target.files) as File[];
        setImagesToUpload(files);
      }
      setIsModalOpen(true);
    };

    input.click();
  };

  const handleImagesUpload = async () => {
    handleUploadImages(imagesToUpload).then(() => {
      imagesToUpload.forEach(image => URL.revokeObjectURL(URL.createObjectURL(image)));
      setIsModalOpen(false);
      setImagesToUpload([]);
    })
  }


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
              }}
            >
              Close
            </IonButton>
          </IonButtons>
          <IonTitle>{text[l].componentTitle}</IonTitle>
          <IonButtons slot='end'>

            <IonButton onClick={() => handleImagesUpload()} disabled={imagesToUpload.length === 0}>
              Upload
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand='full' onClick={handleSelectImages}>Select Images</IonButton>
        <IonList>
          {imagesToUpload.map((image, index) => {
            const imageUrl = URL.createObjectURL(image);
            return (
              <IonItem key={index} button>
                <IonAvatar>
                  <img src={imageUrl} alt={image.name} />
                </IonAvatar>
                <IonLabel>
                  <p>{index}</p>
                </IonLabel>
              </IonItem>
            );
          })}
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default ModalImagesUpload;
