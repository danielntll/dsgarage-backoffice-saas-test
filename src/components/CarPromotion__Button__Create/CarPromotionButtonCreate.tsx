import styles from "./CarPromotionButtonCreate.module.css";
import { useContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { IonButton, IonIcon } from "@ionic/react";
import { add } from "ionicons/icons";
import { useCarPromotionContext } from "../../context/car promotion/contextCarPromotion";

interface ContainerProps {}

const CarPromotionButtonCreate: React.FC<ContainerProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  const { handleOpenModal } = useCarPromotionContext();
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <IonButton onClick={handleOpenModal}>
      {text[l].componentTitle}
      <IonIcon icon={add} />
    </IonButton>
  );
};

export default CarPromotionButtonCreate;
