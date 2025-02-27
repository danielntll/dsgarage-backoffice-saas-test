import { useContext } from "react";
import styles from "./PromotionButtonNew.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { usePromotionsContext } from "../../context/promotions/contextPromotions";
import { IonButton, IonIcon, IonSpinner } from "@ionic/react";
import { add } from "ionicons/icons";

interface ContainerProps {}

const PromotionButtonNew: React.FC<ContainerProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { statusInitPromotionData, openCreationModal } = usePromotionsContext();
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <>
      <IonButton
        disabled={statusInitPromotionData.status !== "success" ? true : false}
        onClick={() => openCreationModal()}
      >
        {text[l].create_promotion}
        {statusInitPromotionData.status !== "success" ? (
          <IonSpinner />
        ) : (
          <IonIcon icon={add} />
        )}
      </IonButton>
    </>
  );
};

export default PromotionButtonNew;
