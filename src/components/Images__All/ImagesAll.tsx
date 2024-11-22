import { useContext, useState } from "react";
import styles from "./ImagesAll.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import { useGalleryContext } from "../../context/gallery/contextGallery";
import { typeImage } from "../../types/typeImage";
import { eye, eyeOffOutline, star, starOutline } from "ionicons/icons";

interface ContainerProps {}

const ImagesAll: React.FC<ContainerProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const {
    galleryData,
    loading,
    error,
    togglePinImage,
    toggleVisibilityImage,
    handleEditClick,
    handleDeleteImage,
    handleShowImageOverlay,
  } = useGalleryContext();

  //CONDITIONS -----------------------
  const [sortBy, setSortBy] = useState<"date" | "alt">("date"); // Add sorting state
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showVisible, setShowVisible] = useState<boolean>(false);
  //FUNCTIONS ------------------------
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
          {galleryData
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
              return (
                <IonCard className={styles.card} key={index + "pinnedImages"}>
                  <img
                    onClick={() => handleShowImageOverlay(item)}
                    className={styles.image}
                    src={item.imageUrl}
                    alt={item.alt}
                  />
                  <IonCardContent>
                    <IonLabel>
                      <h3>{item.alt}</h3>
                      <p>{item.createdAt.toDate().toLocaleDateString()}</p>
                    </IonLabel>
                  </IonCardContent>
                  <div className={styles.buttons}>
                    <div>
                      <IonButton
                        fill={item.isPinned ? "solid" : "outline"}
                        onClick={() => togglePinImage(item)}
                        size="small"
                      >
                        <IonIcon icon={item.isPinned ? star : starOutline} />
                      </IonButton>
                      <IonButton
                        fill={item.isVisible ? "solid" : "outline"}
                        color={"tertiary"}
                        onClick={() => toggleVisibilityImage(item)}
                        size="small"
                      >
                        <IonIcon icon={item.isVisible ? eye : eyeOffOutline} />
                      </IonButton>
                      <IonButton
                        onClick={() => handleEditClick(item)}
                        fill="clear"
                        size="small"
                      >
                        Modifica
                      </IonButton>
                    </div>
                    <div>
                      <IonButton
                        onClick={() => handleDeleteImage(item)}
                        fill="clear"
                        color={"danger"}
                        size="small"
                      >
                        Elimina
                      </IonButton>
                    </div>
                  </div>
                </IonCard>
              );
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
