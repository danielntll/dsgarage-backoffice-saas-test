import { useContext, useState } from "react";
import styles from "./ServicesItem.module.css";
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
import { ellipsisVertical, star } from "ionicons/icons";
import { useServicesContext } from "../../context/services/contextServices";
import { typeService } from "../../types/typeService";

interface ContainerProps {
  data: typeService;
}

const ServicesItem: React.FC<ContainerProps> = ({ data }) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const {
    handleUpdateService,
    toggleArchived,
    togglePinned,
    handleDeleteService,
  } = useServicesContext();
  //CONDITIONS -----------------------
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [popoverEvent, setPopoverEvent] = useState<any>(null);
  //FUNCTIONS ------------------------
  /**
   * ----- handleOptionsClick
   * Apre il menù opzioni
   * @param e
   */
  const handleOptionsClick = (e: any) => {
    e.persist();
    setPopoverEvent(e);
    setIsOpen(true);
  };

  /**
   * ----- handleOpenModifyData
   */
  const handleOpenModifyData = () => {
    handleUpdateService(data);
  };
  /**
   * ----- handleTogglePinned
   */
  const handleTogglePinned = () => {
    togglePinned(data);
  };

  /**
   * ----- handleToggleArchived
   */
  const handleToggleArchived = () => {
    toggleArchived(data);
  };

  /**
   * ----- handleDeleteData
   */
  const handleDeleteData = () => {
    handleDeleteService(data);
  };

  //RETURN COMPONENT -----------------
  return (
    <>
      <IonItem>
        <IonThumbnail className="ion-margin-end">
          <img src={data?.image?.url} alt="" />
        </IonThumbnail>
        <IonLabel>
          <h2 className={styles.title}>
            {data.isPinned && <IonIcon color="primary" icon={star} />}
            {data.title}
          </h2>
          <p>{data.subtitle}</p>
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
              onClick={handleOpenModifyData}
              button={true}
              detail={false}
            >
              Modifica
            </IonItem>
            <IonItem onClick={handleTogglePinned} button={true} detail={false}>
              Preferiti
            </IonItem>
            <IonItem
              onClick={handleToggleArchived}
              button={true}
              detail={false}
            >
              Archivia
            </IonItem>
            <IonItem
              onClick={handleDeleteData}
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

export default ServicesItem;
