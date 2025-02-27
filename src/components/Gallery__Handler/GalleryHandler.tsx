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
  imagesToUpload: File[];
  setImagesToUpload: React.Dispatch<React.SetStateAction<File[]>>;
  selectedImages: typeImage[];
  setSelectedImages: React.Dispatch<React.SetStateAction<typeImage[]>>;
  imageDetails: typeImageUploadData;
  setImageDetails: React.Dispatch<React.SetStateAction<typeImageUploadData>>;
  callbackReset: () => void;
}

const GalleryHandler: React.FC<ContainerProps> = ({
  selectedImages,
  setSelectedImages,
  imagesToUpload,
  setImagesToUpload,
  imageDetails,
  setImageDetails,
  callbackReset,
}) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  const { initState, galleryData, loadMoreData, loading } = useGalleryContext();
  //USE STATES -----------------------
  const [segment, setSegment] = useState<enumImagesHandler>(
    enumImagesHandler.add
  );
  //USE EFFECTS ----------------------
  useEffect(() => {
    initState();
  }, []);
  //FUNCTIONS ------------------------
  const handleToggleSelection = (image: typeImage) => {
    if (
      selectedImages.some(
        (selectedImage: typeImage) => selectedImage.uid === image.uid
      )
    ) {
      setSelectedImages(
        selectedImages.filter((item: typeImage) => item.uid !== image.uid)
      );
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const handleSegmentChange = (event: enumImagesHandler) => {
    callbackReset();
    setSegment(event);
  };
  //RETURN COMPONENT -----------------
  return (
    <div className={styles.container}>
      <IonHeader>
        <IonToolbar>
          {/* <IonSegment
            value={segment}
            onIonChange={(e) =>
              handleSegmentChange(e.detail.value as enumImagesHandler)
            }
          >
            <IonSegmentButton value={enumImagesHandler.select}>
              <IonLabel>{text[l].segment__select}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value={enumImagesHandler.add}>
              <IonLabel>{text[l].segment__add}</IonLabel>
            </IonSegmentButton>
          </IonSegment> */}
        </IonToolbar>
      </IonHeader>
      {/* {segment === enumImagesHandler.select && (
        <>
          <div className={styles.imageGrid}>
            {loading ? (
              <p>{text[l].loading}</p>
            ) : (
              galleryData?.map((image: typeImage, index: number) => {
                return (
                  <div
                    onClick={() => handleToggleSelection(image)}
                    className={styles.imageItem}
                    key={index}
                  >
                    <div className={styles.chipContainer}>
                      {selectedImages.some(
                        (selectedImage) => selectedImage.uid === image.uid
                      ) && (
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
                );
              })
            )}
          </div>
          <IonButton onClick={loadMoreData} expand="block" fill="clear">
            <IonIcon icon={cloudDownloadOutline} className="ion-margin-end" />
            {text[l].load__more}
          </IonButton>
        </>
      )} */}
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
