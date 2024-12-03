import { useContext } from "react";
import styles from "./ServicesCard.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import { typeService } from "../../types/typeService";

interface ContainerProps {
  service: typeService;
}

const ServicesCard: React.FC<ContainerProps> = ({ service }) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <IonCard className={styles.container}>
      <img src={service.imageUrl} alt="" />
      <IonCardHeader>
        <IonCardTitle>{service.title}</IonCardTitle>
        <IonCardSubtitle>
          <p>{service.subtitle}</p>
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <p>{service.description}</p>
      </IonCardContent>
    </IonCard>
  );
};

export default ServicesCard;
