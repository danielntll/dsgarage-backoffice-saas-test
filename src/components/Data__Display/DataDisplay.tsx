import styles from "./DataDisplay.module.css";
import { useContextLanguage } from "../../context/contextLanguage";
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
} from "@ionic/react";
import { CarPromotion } from "../../types/typeCarPromotion";
import { typeImage } from "../../types/typeImage";
import { filter } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import DataDisplayEvent from "../Data__Display__Event/DataDisplayEvent";
import { enumEventData } from "../../enum/enumEventData";
import DataDisplayListCarPromotion from "../Data__Display__List__CarPromotion/DataDisplayListCarPromotion";
import DataDisplayListImages from "../Data__Display__List__Images/DataDisplayListImages";

type data = CarPromotion | typeImage;

interface ContainerProps {
  type: "image" | "carPromotion";
  event: enumEventData;
  data: data[] | null;
}

const DataDisplay: React.FC<ContainerProps> = ({ event, data, type }) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  //USE STATES -----------------------
  // ----- Filters and Orders
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [popoverEvent, setPopoverEvent] = useState<any>(null);
  const [sortBy, setSortBy] = useState<"date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  // ----- Data
  const [_localData, _setLocalData] = useState<data[] | null>(null);
  //USE EFFECTS ----------------------
  useEffect(() => {
    if (data)
      _setLocalData(
        data.sort((a, b) => {
          const dateA = (a.createdAt as Timestamp).toDate();
          const dateB = (b.createdAt as Timestamp).toDate();
          return sortOrder === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        })
      );
    console.log(data);
  }, [data, sortBy, sortOrder]);
  //FUNCTIONS ------------------------
  const handleFilterButtonClick = (e: any) => {
    e.persist();
    setPopoverEvent(e);
    setShowPopover(true);
  };
  //RETURN COMPONENT -----------------
  return (
    <>
      {/* ----- HEADER --------- */}
      <div className={styles.header}>
        <IonButton onClick={handleFilterButtonClick} fill="clear">
          <IonIcon className="icon-margin-right" icon={filter} />
          {text[l].btns.filter}
        </IonButton>
      </div>
      {/* ----- DATA ----------- */}
      <IonList inset>
        {_localData === null || _localData.length === 0 ? (
          <DataDisplayEvent event={event} />
        ) : (
          <>
            {type === "carPromotion" && (
              <DataDisplayListCarPromotion
                data={_localData as CarPromotion[]}
              />
            )}
            {type === "image" && (
              <DataDisplayListImages data={_localData as typeImage[]} />
            )}
          </>
        )}
      </IonList>

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
                  onIonChange={(e) => setSortBy(e.detail.value as "date")}
                  interface="popover"
                >
                  <IonSelectOption value="date">Data</IonSelectOption>
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
          </IonList>
        </IonContent>
      </IonPopover>
    </>
  );
};

export default DataDisplay;
