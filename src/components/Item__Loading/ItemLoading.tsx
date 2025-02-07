import { IonItem, IonLabel, IonSpinner } from "@ionic/react";
import { useContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
interface ContainerProps {}

const ItemLoading: React.FC<ContainerProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  //USE STATES -----------------------
  //USE EFFECTS ----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <IonItem>
      <IonSpinner className="ion-margin-end" />
      <IonLabel color={"warning"}>{text[l].txt}</IonLabel>
    </IonItem>
  );
};

export default ItemLoading;
