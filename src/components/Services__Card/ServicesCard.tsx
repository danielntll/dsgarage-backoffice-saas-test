import { useContext } from "react";
import styles from "./ServicesCard.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import { typeService } from "../../types/typeService";
import { useServicesContext } from "../../context/services/contextServices";

interface ContainerProps {
  service: typeService;
}

const ServicesCard: React.FC<ContainerProps> = ({ service }) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { handleUpdateService, handleDeleteService } = useServicesContext();
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <IonCard className={styles.container}>
      <div className={`${styles.imageContainer} ion-padding-top`}>
        <img className={styles.image} src={service.imageUrl} alt="" />
      </div>
      <IonCardHeader>
        <IonCardSubtitle>
          <p>{service.subtitle}</p>
        </IonCardSubtitle>
        <IonCardTitle>{service.title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>{service.description}</p>
      </IonCardContent>
      <IonButtons>
        <IonButton
          onClick={() => {
            handleUpdateService(service);
          }}
        >
          {text[l].btn__update}
        </IonButton>
        <IonButton
          color={"danger"}
          onClick={() => {
            handleDeleteService(service);
          }}
        >
          {text[l].btn__delete}
        </IonButton>
      </IonButtons>
    </IonCard>
  );
};

export default ServicesCard;
