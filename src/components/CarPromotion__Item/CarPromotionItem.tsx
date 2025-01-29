import { useContext, useState } from "react";
import styles from "./CarPromotionItem.module.css";
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
  IonThumbnail,
} from "@ionic/react";
import { CarPromotion } from "../../types/typeCarPromotion";
import { ellipsisVertical } from "ionicons/icons";
import { useCarPromotionContext } from "../../context/car promotion/contextCarPromotion";

interface ContainerProps {
  data: CarPromotion;
}

const CarPromotionItem: React.FC<ContainerProps> = ({ data }) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { updateIsArchived, updateIsPinned, deleteData } =
    useCarPromotionContext();
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
          <img src={data.images[0].imageUrl} alt="" />
        </IonThumbnail>
        <IonLabel>
          <h3>Modello: {data.carInfo.model}</h3>
          <p>
            Km: {data.carInfo.km} - Prezzo: {data.carInfo.price} - Anno:{" "}
            {data.carInfo.year}
          </p>
          <p>Caratteristiche: {data.carDetails.features?.join(", ")}</p>
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
            <IonItem button={true} detail={false}>
              Modifica
            </IonItem>
            <IonItem
              onClick={() => updateIsPinned(data.uid!, !data.isPinned)}
              button={true}
              detail={false}
            >
              Preferiti
            </IonItem>
            <IonItem
              onClick={() => updateIsArchived(data.uid!, !data.isArchived)}
              button={true}
              detail={false}
            >
              Archivia
            </IonItem>
            <IonItem
              onClick={() => deleteData(data.uid!)}
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

export default CarPromotionItem;
