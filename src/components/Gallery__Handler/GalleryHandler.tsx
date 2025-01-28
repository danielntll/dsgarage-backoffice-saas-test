import styles from "./GalleryHandler.module.css";
import { useContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import {
  IonBadge,
  IonButton,
  IonHeader,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from "@ionic/react";
import { enumImagesHandler } from "../../enum/enumImagesHandler";
import { useEffect, useState } from "react";
import { useGalleryContext } from "../../context/gallery/contextGallery";
import { typeImage } from "../../types/typeImage";
import { checkmark, cloudDownloadOutline } from "ionicons/icons";
import ImagesAdd from "../Images__Add/ImagesAdd";
import { typeImageUploadData } from "../../types/typeImageUploadData";
interface ContainerProps {
  selectedImages: typeImage[];
  setSelectedImages: React.Dispatch<React.SetStateAction<typeImage[]>>;
}

const GalleryHandler: React.FC<ContainerProps> = ({
  selectedImages,
  setSelectedImages,
}) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  const { initState, galleryData, loadMoreData, loading, handleUploadImages } =
    useGalleryContext();
  //USE STATES -----------------------
  const [segment, setSegment] = useState<enumImagesHandler>(
    enumImagesHandler.select
  );

  const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);
  const [imageDetails, setImageDetails] = useState<typeImageUploadData>({});

  //USE EFFECTS ----------------------
  useEffect(() => {
    initState();
  }, []);
  //FUNCTIONS ------------------------
  const handleToggleSelection = (image: typeImage) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter((item) => item !== image));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };
  const handleImagesUpload = async () => {
    if (imagesToUpload.length === 0) return;
    handleUploadImages(imagesToUpload, imageDetails).then(
      (uploadedImages: typeImage[] | null) => {
        // Use the returned value
        if (uploadedImages) {
          // Check if upload was successful
          imagesToUpload.forEach((image) =>
            URL.revokeObjectURL(URL.createObjectURL(image))
          );
          setImagesToUpload([]);
          setImageDetails({});
        }
      }
    );
  };
  //RETURN COMPONENT -----------------
  return (
    <div className={styles.container}>
      <IonHeader>
        <IonToolbar>
          <IonSegment
            value={segment}
            onIonChange={(e) => setSegment(e.detail.value as enumImagesHandler)}
          >
            <IonSegmentButton value={enumImagesHandler.select}>
              <IonLabel>{text[l].segment__select}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value={enumImagesHandler.add}>
              <IonLabel>{text[l].segment__add}</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      {segment === enumImagesHandler.select && (
        <>
          <div className={styles.imageGrid}>
            {loading ? (
              <p>{text[l].loading}</p>
            ) : (
              galleryData?.map((image: typeImage, index: number) => (
                <div
                  onClick={() => handleToggleSelection(image)}
                  className={styles.imageItem}
                  key={index}
                >
                  <div className={styles.chipContainer}>
                    {selectedImages.includes(image) && (
                      <IonBadge color={"success"}>
                        <IonIcon icon={checkmark} />
                        {text[l].selected}
                      </IonBadge>
                    )}
                  </div>
                  <img
                    className={styles.image}
                    src={image.imageUrl}
                    alt={`Image ${index + 1}`}
                  />
                </div>
              ))
            )}
          </div>
          <IonButton onClick={loadMoreData} expand="block" fill="clear">
            <IonIcon icon={cloudDownloadOutline} className="ion-margin-end" />
            {text[l].load__more}
          </IonButton>
        </>
      )}
      {segment === enumImagesHandler.add && (
        <>
          <ImagesAdd
            selectedFiles={imagesToUpload}
            setSelectedFiles={setImagesToUpload}
            imageDetails={imageDetails}
            setImageDetails={setImageDetails}
          />
        </>
      )}
    </div>
  );
};

export default GalleryHandler;
