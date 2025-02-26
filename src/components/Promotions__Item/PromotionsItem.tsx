import { useContext, useState } from "react";
import styles from "./PromotionsItem.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import {
  IonBadge,
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonThumbnail,
} from "@ionic/react";
import { ellipsisVertical, star } from "ionicons/icons";
import { usePromotionsContext } from "../../context/promotions/contextPromotions";
import { typePromotion } from "../../types/typePromotion";
import { Timestamp } from "firebase/firestore";
import { isPromotionAvailable } from "../../utils/isPromotionAvailable";

interface ContainerProps {
  data: typePromotion;
}

const PromotionsItem: React.FC<ContainerProps> = ({ data }) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const {
    toggleIsPinned,
    toggleIsArchived,
    openUpdateModal,
    handleDeletePromotion,
  } = usePromotionsContext();
  //CONDITIONS -----------------------
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [popoverEvent, setPopoverEvent] = useState<any>(null);
  //FUNCTIONS ------------------------
  const handleOptionsClick = (e: any) => {
    e.persist();
    setPopoverEvent(e);
    setIsOpen(true);
  };

  //RETURN COMPONENT -----------------
  return (
    <>
      <IonItem>
        <IonThumbnail className="ion-margin-end">
          <img src={data?.imageUrl ?? ""} alt="" />
        </IonThumbnail>
        <IonLabel>
          <div>
            {isPromotionAvailable(data) === "expired" ? (
              <IonBadge color={"danger"}>{text[l].expired}</IonBadge>
            ) : isPromotionAvailable(data) === "inProgress" ? (
              <IonBadge color={"warning"}>{text[l].inProgress}</IonBadge>
            ) : (
              <IonBadge color={"primary"}>{text[l].notStarted}</IonBadge>
            )}
          </div>
          <h2 className={styles.title}>
            {data.isPinned && <IonIcon color="primary" icon={star} />}{" "}
            {data.title}
          </h2>
          <p>{data.subtitle}</p>
          <p>
            INIZIO: {data.startAt.toDate().toLocaleDateString()} - FINE:{" "}
            {data.endAt.toDate().toLocaleDateString()}
          </p>
          <p>{data.description}</p>
        </IonLabel>
        <IonButton fill="clear" onClick={handleOptionsClick}>
          <IonIcon icon={ellipsisVertical} />
        </IonButton>
      </IonItem>
      {/* ------- */}
      <IonPopover
        isOpen={isOpen}
        event={popoverEvent}
        dismissOnSelect={true}
        onDidDismiss={() => setIsOpen(false)}
      >
        <IonContent>
          <IonList>
            <IonItem
              onClick={() => openUpdateModal(data)}
              button={true}
              detail={false}
            >
              Modifica
            </IonItem>
            <IonItem
              onClick={() => toggleIsPinned(data)}
              button={true}
              detail={false}
            >
              Preferiti
            </IonItem>
            <IonItem
              onClick={() => toggleIsArchived(data)}
              button={true}
              detail={false}
            >
              Archivia
            </IonItem>
            <IonItem
              onClick={() => handleDeletePromotion(data)}
              color={"danger"}
              button={true}
              detail={false}
            >
              Elimina
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>
    </>
  );
};

export default PromotionsItem;
