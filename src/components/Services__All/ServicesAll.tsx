import { useContext } from "react";
import styles from "./ServicesAll.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { useServicesContext } from "../../context/services/contextServices";
import { IonCol, IonGrid, IonRow } from "@ionic/react";
import ServicesCard from "../Services__Card/ServicesCard";

interface ContainerProps {}

const ServicesAll: React.FC<ContainerProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { services, loadingServices } = useServicesContext(); // Access services and loading state

  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <div className={styles.container}>
      {/* Conditionally render content based on loading state */}
      {loadingServices ? (
        <p>Loading services...</p> // Or a loading indicator
      ) : (
        <IonGrid>
          <IonRow>
            {services.map((service, index) => (
              <IonCol size-md="4" key={service.uid + index}>
                <ServicesCard service={service} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      )}
    </div>
  );
};

export default ServicesAll;
