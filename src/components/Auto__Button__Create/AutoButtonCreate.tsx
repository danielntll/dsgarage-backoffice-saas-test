import { useContext } from "react";
import styles from "./AutoButtonCreate.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { IonButton, IonIcon } from "@ionic/react";
import { add } from "ionicons/icons";

interface ContainerProps {}

const AutoButtonCreate: React.FC<ContainerProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <IonButton>
      <IonIcon icon={add} />
      {text[l].componentTitle}
    </IonButton>
  );
};

export default AutoButtonCreate;
