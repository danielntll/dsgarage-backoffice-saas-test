import { useContext } from "react";
import styles from "./PromotionButtonNew.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { usePromotionsContext } from "../../context/promotions/contextPromotions";
import { IonButton } from "@ionic/react";

interface ContainerProps {}

const PromotionButtonNew: React.FC<ContainerProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { openCreationModal } = usePromotionsContext();
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <IonButton onClick={() => openCreationModal()}>
      {text[l].create_promotion}
    </IonButton>
  );
};

export default PromotionButtonNew;
