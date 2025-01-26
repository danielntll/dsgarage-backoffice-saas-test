import { useContext } from "react";
import styles from "./CarPromotionList.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { useCarPromotionContext } from "../../context/car promotion/contextCarPromotion";
import { IonItem, IonLabel, IonList } from "@ionic/react";
import { UsedCarCard } from "../../types/typeCarPromotion";
import CarPromotionItem from "../CarPromotion__Item/CarPromotionItem";

interface ContainerProps {}

const CarPromotionList: React.FC<ContainerProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { carPromotions } = useCarPromotionContext();
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <IonList inset>
      {carPromotions.length === 0 ? (
        <IonItem>
          <IonLabel>{text[l].empty}</IonLabel>
        </IonItem>
      ) : (
        carPromotions.map((car: UsedCarCard, index: number) => {
          return <CarPromotionItem data={car} key={index} />;
        })
      )}
    </IonList>
  );
};

export default CarPromotionList;
