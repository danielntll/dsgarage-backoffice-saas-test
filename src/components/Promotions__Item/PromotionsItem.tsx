import { useContext, useState } from "react";
import styles from "./PromotionsItem.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import {
  IonBadge,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonPopover,
  IonThumbnail,
} from "@ionic/react";
import { typePromotion } from "../../types/typeTarghet";
import {
  eye,
  eyeOff,
  pencil,
  star,
  starHalf,
  trashBinOutline,
} from "ionicons/icons";
import { usePromotionsContext } from "../../context/promotions/contextPromotions";
import { useServicesContext } from "../../context/services/contextServices";

interface ContainerProps {
  promotion: typePromotion;
}

const PromotionsItem: React.FC<ContainerProps> = ({ promotion }) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const {
    handleDeletePromotion,
    togglePinPromotion,
    toggleVisibilityPromotion,
    openPromotionModal,
  } = usePromotionsContext();

  const { services } = useServicesContext();
  //CONDITIONS -----------------------
  const [showPopover, setShowPopover] = useState(false);
  const [popoverEvent, setPopoverEvent] = useState<any>(null);

  //FUNCTIONS ------------------------
  const handleOptionsClick = (e: any) => {
    e.persist();
    setPopoverEvent(e);
    setShowPopover(true);
  };

  //RETURN COMPONENT -----------------
  return (
    <>
      <IonItemSliding>
        {/* ----------- ACTIONS START ------- */}
        <IonItemOptions side="start">
          <IonItemOption
            color="danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePromotion(promotion);
            }}
          >
            <IonIcon icon={trashBinOutline} slot="icon-only" />
          </IonItemOption>
        </IonItemOptions>
        {/* ----------- ITEM ------- */}
        <IonItem button onClick={handleOptionsClick}>
          <IonThumbnail className="ion-margin-end">
            <img
              src={
                promotion.imageUrl == ""
                  ? services.find((s) => s.title == promotion.category)
                    ?.imageUrl
                  : promotion.imageUrl
              }
            />
          </IonThumbnail>
          <IonLabel class="ion-text-nowrap">
            <h3>{promotion.title}</h3>
            <p>{promotion.subtitle}</p>
            <p>{promotion.description}</p>
            <p>
              Inizio:{" "}
              {promotion.startAt.toDate().toLocaleDateString("it-IT", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })} - Fine:{" "}
              {promotion.endAt.toDate().toLocaleDateString("it-IT", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </IonLabel>
          {promotion.isVisible ?
            <IonBadge color={promotion.startAt.toDate() <= new Date() && new Date() <= promotion.endAt.toDate() ? 'success' : 'danger'}>
              {promotion.startAt.toDate() <= new Date() && new Date() <= promotion.endAt.toDate() ? 'In corso' : 'Scaduta'}
            </IonBadge> :
            <IonBadge color={"warning"}>
              Non visibile
            </IonBadge>
          }

        </IonItem>
        {/* ----------- ACTIONS END ------- */}
        <IonItemOptions side="end">
          {/* <IonItemOption
            color={promotion.isPinned ? "primary" : "medium"}
            onClick={(e) => {
              e.stopPropagation();
              togglePinPromotion(promotion);
            }}
          >
            <IonIcon
              icon={promotion.isPinned ? star : starHalf}
              slot="icon-only"
            />
          </IonItemOption> */}
          <IonItemOption
            color={promotion.isVisible ? "primary" : "medium"}
            onClick={(e) => {
              e.stopPropagation();
              toggleVisibilityPromotion(promotion);
            }}
          >
            <IonIcon
              icon={promotion.isVisible ? eye : eyeOff}
              slot="icon-only"
            />
          </IonItemOption>
          <IonItemOption
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              openPromotionModal(promotion);
            }}
          >
            <IonIcon icon={pencil} slot="icon-only" />
          </IonItemOption>
        </IonItemOptions>
      </IonItemSliding>
      {/* ---------------- ----------------------- */}
      <IonPopover
        isOpen={showPopover}
        event={popoverEvent}
        onDidDismiss={() => setShowPopover(false)}
      >
        <IonList>
          <IonListHeader>{promotion.title}</IonListHeader>
          <IonItem
            button
            onClick={(e) => {
              e.stopPropagation();
              openPromotionModal(promotion);
              setShowPopover(false);
            }}
          >
            <IonIcon icon={pencil} slot="start" />
            <IonLabel>Modifica</IonLabel>
          </IonItem>
          {/* <IonItem
            button
            onClick={(e) => {
              e.stopPropagation();
              togglePinPromotion(promotion);
              setShowPopover(false);
            }}
          >
            <IonIcon icon={promotion.isPinned ? star : starHalf} slot="start" />
            <IonLabel>
              {promotion.isPinned ? "Rimuovi Pin" : "Aggiungi Pin"}
            </IonLabel>
          </IonItem> */}
          <IonItem
            button
            onClick={(e) => {
              e.stopPropagation();
              toggleVisibilityPromotion(promotion);
              setShowPopover(false);
            }}
          >
            <IonIcon icon={!promotion.isVisible ? eye : eyeOff} slot="start" />
            <IonLabel>{promotion.isVisible ? "Nascondi" : "Mostra"}</IonLabel>
          </IonItem>
          <IonItemOption
            color="danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDeletePromotion(promotion);
              setShowPopover(false);
            }}
          >
            <IonIcon icon={trashBinOutline} slot="start" />
            <IonLabel>Elimina</IonLabel> {/* Explicit label */}
          </IonItemOption>
        </IonList>
      </IonPopover>
    </>
  );
};

export default PromotionsItem;
