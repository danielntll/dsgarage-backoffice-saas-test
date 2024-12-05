import { useContext, useEffect, useState } from "react";
import styles from "./PromotionsAll.module.css";
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
import {
  downloadOutline,
  filterOutline,
  gridOutline,
  listOutline,
} from "ionicons/icons";
import { usePromotionsContext } from "../../context/promotions/contextPromotions";
import { typePromotion } from "../../types/typeTarghet";
import PromotionsItem from "../Promotions__Item/PromotionsItem";

interface ContainerProps {
  searchTerm: string;
}

const PromotionsAll: React.FC<ContainerProps> = ({ searchTerm }) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { promotionsData, loadMoreData } = usePromotionsContext();
  //CONDITIONS -----------------------
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showVisible, setShowVisible] = useState<boolean>(false);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<any>(null);
  const [listView, setListView] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filtredData, setFiltredData] = useState<typePromotion[]>([]);
  //FUNCTIONS ------------------------

  useEffect(() => {
    setFiltredData(
      promotionsData
        .sort((a, b) => {
          if (sortBy === "date") {
            const dateA = a.createdAt.toDate();
            const dateB = b.createdAt.toDate();
            return sortOrder === "asc"
              ? dateA.getTime() - dateB.getTime()
              : dateB.getTime() - dateA.getTime();
          } else if (sortBy === "name") {
            return sortOrder === "asc"
              ? a.title.localeCompare(b.title)
              : b.title.localeCompare(a.title);
          } else {
            return 0;
          }
        })
        .filter((item: typePromotion, index: number) =>
          showVisible ? item.isVisible : true
        )
        .filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [searchTerm, showVisible, sortBy, sortOrder, promotionsData]);

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
            {filtredData.map((item: typePromotion, index: number) => {
              return (
                <div>
                  <p>{item.title}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <IonList inset>
            {filtredData.map((item: typePromotion, index: number) => (
              <PromotionsItem key={index + item.uid} promotion={item} />
            ))}
          </IonList>
        )}

        {promotionsData.length === 0 ? (
          <IonItem>
            <IonLabel>
              <p>{text[l].no__data}</p>
            </IonLabel>
          </IonItem>
        ) : (
          <IonButton
            onClick={handleLoadMoreData}
            disabled={isLoading}
            expand="block"
          >
            <IonIcon icon={downloadOutline} className="ion-margin-end" />
            {isLoading ? text[l].loading : text[l].btn__load__more}
          </IonButton>
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
                    setSortBy(e.detail.value as "date" | "name")
                  }
                  interface="popover" // or "action-sheet"
                >
                  <IonSelectOption value="date">Data</IonSelectOption>
                  <IonSelectOption value="name">Nome</IonSelectOption>
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

export default PromotionsAll;
