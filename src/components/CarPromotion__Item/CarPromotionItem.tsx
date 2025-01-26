import { useContext } from "react";
import styles from "./CarPromotionItem.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { IonItem, IonLabel, IonThumbnail } from "@ionic/react";
import { UsedCarCard } from "../../types/typeCarPromotion";

interface ContainerProps {
  data: UsedCarCard;
}

const CarPromotionItem: React.FC<ContainerProps> = ({ data }) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <IonItem>
      <IonThumbnail>
        <img src="" alt="" />
      </IonThumbnail>
      <IonLabel>
        <p></p>
        <h3></h3>
      </IonLabel>
    </IonItem>
  );
};

export default CarPromotionItem;
