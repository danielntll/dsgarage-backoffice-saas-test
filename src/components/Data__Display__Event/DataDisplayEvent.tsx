import { useContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { enumEventData } from "../../enum/enumEventData";
import { IonItem, IonLabel, IonSpinner } from "@ionic/react";
interface ContainerProps {
  event: enumEventData;
}

const DataDisplayEvent: React.FC<ContainerProps> = ({ event }) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  //USE STATES -----------------------
  //USE EFFECTS ----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  switch (event) {
    case "isLoading":
      return (
        <IonItem>
          <IonLabel>
            <IonSpinner className="ion-margin-end" />
            {text[l].isLoading}
          </IonLabel>
        </IonItem>
      );
    case "isEmpty":
      return (
        <IonItem>
          <IonLabel>{text[l].isEmpty}</IonLabel>
        </IonItem>
      );
    case "isError":
      return (
        <IonItem>
          <IonLabel>
            <IonSpinner className="ion-margin-end" />
            {text[l].isError}
          </IonLabel>
        </IonItem>
      );
  }
};

export default DataDisplayEvent;
