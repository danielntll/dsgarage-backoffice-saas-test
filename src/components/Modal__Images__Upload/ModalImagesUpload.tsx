import { useContext, useState } from 'react';
import styles from './ModalImagesUpload.module.css';
import { ContextLanguage } from '../../context/contextLanguage';
import { text } from './text';
import { IonAccordion, IonAccordionGroup, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonModal, IonThumbnail, IonTitle, IonToolbar } from '@ionic/react';
import { useGalleryContext } from '../../context/contextGallery';
import { typeImageToUpload } from '../../types/typeImageToUpload';

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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // Track expanded accordion
  const [imageDetails, setImageDetails] = useState<{ [key: number]: { alt: string, description: string } }>({});

  //FUNCTIONS ------------------------

  const handleAccordionClick = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index); // Toggle accordion
  };

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
    if (imagesToUpload.length === 0) return;


    const toUpload: typeImageToUpload[] = imagesToUpload.map((image, index) => ({
      file: image,
      alt: imageDetails[index]?.alt || image.name.split('.')[0], // Use stored alt or filename
      description: imageDetails[index]?.description || '',      // Use stored description or empty string
    }));

    handleUploadImages(toUpload).then((uploadSuccessful) => { // Use the returned value
      if (uploadSuccessful) { // Check if upload was successful
        imagesToUpload.forEach(image => URL.revokeObjectURL(URL.createObjectURL(image)));
        setIsModalOpen(false);
        setImagesToUpload([]);
        setImageDetails({}); // Clear image details after successful upload.
      }
    });
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
                setImagesToUpload([]);
              }}
              color="medium"
            >
              {text[l].closeButton}
            </IonButton>
          </IonButtons>
          <IonTitle>{text[l].componentTitle}</IonTitle>
          <IonButtons slot='end'>

            <IonButton onClick={() => handleImagesUpload()} disabled={imagesToUpload.length === 0}> {/* Disable if no images */}
              {text[l].uploadButton}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand='block' onClick={handleSelectImages}>
          {text[l].selectImagesButton}
        </IonButton>
        <IonLabel>
          <p className='ion-padding-vertical'>
            {`${text[l].text1}: ${imagesToUpload.length}`}
          </p>
        </IonLabel>
        <IonAccordionGroup>
          {imagesToUpload.map((image, index) => {
            const imageUrl = URL.createObjectURL(image);
            const imageSize = (image.size / 1024).toFixed(2);
            return (
              <IonAccordion key={index} value={`${index}`} onClick={() => handleAccordionClick(index)}>
                <IonItem slot="header" color={expandedIndex === index ? "light" : "medium"}> {/* Change color based on expansion */}
                  <IonThumbnail slot="start" className={styles.thumbnail}>
                    <img src={imageUrl} alt={image.name} />
                  </IonThumbnail>
                  <IonLabel>
                    <h3>{image.name}</h3>
                    <p>{image.type}, {imageSize} KB</p>
                  </IonLabel>
                </IonItem>
                <div slot="content" className={styles.accordionContent}> {/* Apply styles for content */}
                  <IonItem>
                    <IonLabel position="stacked">{"ALT"}</IonLabel>
                    <IonInput
                      value={imageDetails[index]?.alt || image.name.split('.')[0]} // Pre-fill with filename (without extension)
                      onIonChange={(e) => setImageDetails({ ...imageDetails, [index]: { ...imageDetails[index], alt: e.detail.value! } })}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">{"DESC"}</IonLabel>
                    <IonInput
                      value={imageDetails[index]?.description || ''}
                      onIonChange={(e) => setImageDetails({ ...imageDetails, [index]: { ...imageDetails[index], description: e.detail.value! } })}
                    />
                  </IonItem>
                </div>

              </IonAccordion>
            );
          })}
        </IonAccordionGroup>
      </IonContent>
    </IonModal>
  );
};

export default ModalImagesUpload;
