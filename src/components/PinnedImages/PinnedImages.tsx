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
import { useGalleryContext } from "../../context/gallery/contextGallery";
import { typeImage } from "../../types/typeImage";
import ImageItem from "../Image__Item/ImageItem";

interface ContainerProps {}

const PinnedImages: React.FC<ContainerProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { loading, error, pinnedImages } = useGalleryContext();

  const [previewPinned, setPreviewPinned] = useState<typeImage[]>([]);
  //CONDITIONS -----------------------
  useEffect(() => {
    setPreviewPinned(pinnedImages);
  }, [pinnedImages]);
  //FUNCTIONS ------------------------
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
        </IonListHeader>

        {pinnedImages.map((item: typeImage, index: number) => {
          return <ImageItem image={item} key={index + "pinnedImages list"} />;
        })}
        {pinnedImages.length === 0 ? (
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
