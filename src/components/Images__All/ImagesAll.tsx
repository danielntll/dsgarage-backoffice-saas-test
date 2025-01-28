import { useContext, useState } from "react";
import styles from "./ImagesAll.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonSelect,
  IonSelectOption,
  IonToggle,
} from "@ionic/react";
import { useGalleryContext } from "../../context/gallery/contextGallery";
import { typeImage } from "../../types/typeImage";
import ImageCard from "../Image__Card/ImageCard";
import {
  downloadOutline,
  filterOutline,
  gridOutline,
  listOutline,
} from "ionicons/icons";

import ImageItem from "../Image__Item/ImageItem";

interface ContainerProps {
  searchTerm: string;
}

const ImagesAll: React.FC<ContainerProps> = ({ searchTerm }) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { galleryData, loading, error, loadMoreData } = useGalleryContext();

  //CONDITIONS -----------------------
  const [sortBy, setSortBy] = useState<"date" | "alt">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showVisible, setShowVisible] = useState<boolean>(false);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<any>(null);
  const [listView, setListView] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //FUNCTIONS ------------------------
  const filteredGalleryData = galleryData?.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleFilterButtonClick = (e: any) => {
    e.persist(); // Important to persist the event
    setPopoverEvent(e);
    setShowPopover(true);
  };

  const handleLoadMoreData = async () => {
    setIsLoading(true);
    await loadMoreData()
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  };

  //RETURN COMPONENT -----------------
  if (error) return <div> {error && <p>{text[l].error__images}</p>}</div>;
  return (
    <>
      <div className={`ion-padding ${styles.container}`}>
        <IonLabel>
          {text[l].componentTitle}
          <p>{text[l].subtitle}</p>
        </IonLabel>
        <div className={` ${styles.sortOptions}`}>
          <IonButton size="small" onClick={handleFilterButtonClick}>
            <IonIcon className="ion-margin-end" icon={filterOutline} />
            {text[l].btn__filter}
          </IonButton>
          <IonButton
            fill="clear"
            size="small"
            onClick={() => setListView(!listView)}
          >
            <IonIcon
              className="ion-margin-end"
              icon={listView == true ? listOutline : gridOutline}
            />
            {listView == true ? text[l].view__list : text[l].view__grid}
          </IonButton>
        </div>
        {listView === false ? (
          <div className={styles.gallery}>
            {filteredGalleryData
              ?.filter((item) => (showVisible ? item.isVisible : true))
              .sort((a, b) => {
                if (sortBy === "date") {
                  const dateA = a.createdAt.toDate();
                  const dateB = b.createdAt.toDate();
                  return sortOrder === "asc"
                    ? dateA.getTime() - dateB.getTime()
                    : dateB.getTime() - dateA.getTime();
                } else {
                  return sortOrder === "asc"
                    ? a.alt.localeCompare(b.alt)
                    : b.alt.localeCompare(a.alt);
                }
              })
              .map((item: typeImage, index: number) => {
                return (
                  <ImageCard key={index + "pinnedImages grid"} image={item} />
                );
              })}
          </div>
        ) : (
          <IonList inset>
            {filteredGalleryData?.map((item: typeImage, index: number) => (
              <ImageItem image={item} key={index + "pinnedImages list"} />
            ))}
          </IonList>
        )}
        <IonButton
          onClick={handleLoadMoreData}
          disabled={isLoading}
          expand="block"
        >
          <IonIcon icon={downloadOutline} className="ion-margin-end" />
          {loading ? text[l].loading__images : text[l].btn__load__more}
        </IonButton>
        {galleryData?.length === 0 ? (
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
      <IonPopover
        isOpen={showPopover}
        event={popoverEvent}
        onDidDismiss={() => setShowPopover(false)}
      >
        <IonContent>
          <IonList>
            <IonItem>
              <IonLabel>
                <p>Ordina per:</p>

                <IonSelect
                  value={sortBy}
                  onIonChange={(e) =>
                    setSortBy(e.detail.value as "date" | "alt")
                  }
                  interface="popover" // or "action-sheet"
                >
                  <IonSelectOption value="date">Data</IonSelectOption>
                  <IonSelectOption value="alt">Testo Alt</IonSelectOption>
                </IonSelect>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <p>Ordine:</p>
                <IonSelect
                  value={sortOrder}
                  onIonChange={(e) =>
                    setSortOrder(e.detail.value as "asc" | "desc")
                  }
                  interface="popover"
                >
                  <IonSelectOption value="asc">Crescente</IonSelectOption>
                  <IonSelectOption value="desc">Decrescente</IonSelectOption>
                </IonSelect>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <p>Mostra solo visibili</p>
              </IonLabel>
              <IonToggle
                checked={showVisible}
                onIonChange={(e) => setShowVisible(e.detail.checked)}
              />
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>
    </>
  );
};

export default ImagesAll;
