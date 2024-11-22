import { useContext, useState } from "react";
import styles from "./ImagesAll.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import {
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonToggle,
} from "@ionic/react";
import { useGalleryContext } from "../../context/gallery/contextGallery";
import { typeImage } from "../../types/typeImage";
import ImageButtonDelete from "../Image__Button__Delete/ImageButtonDelete";
import ImageButtonModify from "../Image__Button__Modify/ImageButtonModify";
import ImageButtonVisibility from "../Image__Button__Visibility/ImageButtonVisibility";
import ImageButtonPin from "../Image__Button__Pin/ImageButtonPin";
import ImageCard from "../Image__Card/ImageCard";

interface ContainerProps {
  searchTerm: string;
}

const ImagesAll: React.FC<ContainerProps> = ({ searchTerm }) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { galleryData, loading, error, handleShowImageOverlay } =
    useGalleryContext();

  //CONDITIONS -----------------------
  const [sortBy, setSortBy] = useState<"date" | "alt">("date"); // Add sorting state
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showVisible, setShowVisible] = useState<boolean>(false);
  //FUNCTIONS ------------------------
  const filteredGalleryData = galleryData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //RETURN COMPONENT -----------------
  if (loading) return <div>Loading gallery...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <>
      <div className={`ion-padding ${styles.container}`}>
        <IonLabel>
          {text[l].componentTitle}
          <p>{text[l].subtitle}</p>
        </IonLabel>
        <div className={`ion-padding ${styles.sortOptions}`}>
          <p>Ordina:</p>
          <IonSelect
            value={sortBy}
            onIonChange={(e) => setSortBy(e.detail.value as "date" | "alt")}
            interface="popover" // or "action-sheet"
          >
            <IonSelectOption value="date">Date</IonSelectOption>
            <IonSelectOption value="alt">Alt Text</IonSelectOption>
          </IonSelect>
          <IonSelect
            value={sortOrder}
            onIonChange={(e) =>
              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
            }
            interface="popover" // or "action-sheet"
          >
            <IonSelectOption value="asc">Ascending</IonSelectOption>
            <IonSelectOption value="desc">Descending</IonSelectOption>
          </IonSelect>
          <IonToggle
            checked={showVisible}
            onIonChange={(e) => setShowVisible(e.detail.checked)}
          >
            Show Visible Only
          </IonToggle>
        </div>
        <div className={styles.gallery}>
          {filteredGalleryData
            .filter((item) => (showVisible ? item.isVisible : true))
            .sort((a, b) => {
              if (sortBy === "date") {
                const dateA = a.createdAt.toDate();
                const dateB = b.createdAt.toDate();
                return sortOrder === "asc"
                  ? dateA.getTime() - dateB.getTime()
                  : dateB.getTime() - dateA.getTime();
              } else {
                // sortBy === "alt"
                return sortOrder === "asc"
                  ? a.alt.localeCompare(b.alt)
                  : b.alt.localeCompare(a.alt);
              }
            })
            .map((item: typeImage, index: number) => {
              return <ImageCard key={index + "pinnedImages"} image={item} />;
            })}
        </div>
        {galleryData.length === 0 ? (
          <IonItem>
            <IonLabel>
              <p>{text[l].noImages}</p>
            </IonLabel>
          </IonItem>
        ) : (
          <></>
        )}
      </div>
      {/* ----------------- EXTRA UI ----------------------*/}
    </>
  );
};

export default ImagesAll;
