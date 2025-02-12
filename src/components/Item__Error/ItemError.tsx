import { IonIcon, IonItem, IonLabel, IonSpinner } from "@ionic/react";
import { useContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { close } from "ionicons/icons";
interface ContainerProps {}

const ItemError: React.FC<ContainerProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  //USE STATES -----------------------
  //USE EFFECTS ----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <IonItem>
      <IonIcon icon={close} color="error" className="ion-margin-end" />
      <IonLabel color={"error"}>{text[l].txt}</IonLabel>
    </IonItem>
  );
};

export default ItemError;
