import { IonIcon, IonItem, IonLabel, IonThumbnail } from "@ionic/react";
import { useContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { easelOutline } from "ionicons/icons";
interface ContainerProps {}

const ItemEmpty: React.FC<ContainerProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  //USE STATES -----------------------
  //USE EFFECTS ----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <IonItem>
      <IonIcon icon={easelOutline} className="ion-margin-end" />
      <IonLabel>{text[l].txt}</IonLabel>
    </IonItem>
  );
};

export default ItemEmpty;
