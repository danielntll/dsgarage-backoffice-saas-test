import { useContext, useEffect, useState } from "react";
import styles from "./PinnedImages.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import {
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonThumbnail,
} from "@ionic/react";
import { useGalleryContext } from "../../context/contextGallery";
import { typeImage } from "../../types/typeImage";

interface ContainerProps {}

const PinnedImages: React.FC<ContainerProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { loading, error, pinnedImages } = useGalleryContext();

  const [previewPinned, setPreviewPinned] = useState<typeImage[]>([]);
  //CONDITIONS -----------------------
  useEffect(() => {
    if (pinnedImages?.length > 3) {
      setPreviewPinned([pinnedImages[0], pinnedImages[1], pinnedImages[2]]);
    } else {
      setPreviewPinned(pinnedImages);
    }
  }, [pinnedImages]);
  //FUNCTIONS ------------------------
  const handleEditPinnedImages = () => {
    console.log("Edit pinned images clicked");
  };
  //RETURN COMPONENT -----------------
  if (loading) return <div>Loading gallery...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className={styles.container}>
      <IonList inset>
        <IonListHeader>
          <IonLabel>
            {text[l].componentTitle}
            <p>{text[l].subtitle}</p>
          </IonLabel>
          <IonButton onClick={handleEditPinnedImages}>
            {text[l].editButton}
          </IonButton>
        </IonListHeader>

        {previewPinned.map((item: typeImage, index: number) => {
          return (
            <IonItem key={index + "pinnedImages"}>
              <IonThumbnail className="ion-margin-end">
                <img src={item.imageUrl} alt={item.alt} />
              </IonThumbnail>
              <IonLabel>
                <h3>{item.alt}</h3>
                <p>{item.createdAt.toDate().toLocaleDateString()}</p>
              </IonLabel>
            </IonItem>
          );
        })}
        {previewPinned.length === 0 ? (
          <IonItem>
            <IonLabel>
              <p>{text[l].noImages}</p>
            </IonLabel>
          </IonItem>
        ) : (
          <></>
        )}
      </IonList>
    </div>
  );
};

export default PinnedImages;
