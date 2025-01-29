import styles from "./CarPromotionList.module.css";
import { useContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { useCarPromotionContext } from "../../context/car promotion/contextCarPromotion";
import { IonItem, IonLabel, IonList } from "@ionic/react";
import CarPromotionItem from "../CarPromotion__Item/CarPromotionItem";
import { CarPromotion } from "../../types/typeCarPromotion";
import { enumCarPromotionSegments } from "../../enum/enumCarPromotionSegments";
import { useCallback, useEffect, useState } from "react";

interface ContainerProps {
  filter: enumCarPromotionSegments;
}

const CarPromotionList: React.FC<ContainerProps> = ({ filter }) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  const { carPromotions, initData } = useCarPromotionContext();
  // USE EFFECTS----------------------
  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    console.log("1 --- ", carPromotions);
    filterPromotions(carPromotions);
  }, [filter, carPromotions]);

  //USE STATES -----------------------
  const [filteredPromotions, setFilteredPromotions] =
    useState<CarPromotion[]>(carPromotions);
  //FUNCTIONS ------------------------
  const filterPromotions = (data: CarPromotion[]) => {
    console.log("2 ---- ", data);
    let filteredPromotions: CarPromotion[] = [];
    switch (filter) {
      case enumCarPromotionSegments.all:
        filteredPromotions = data.filter(
          (promotion: CarPromotion) => promotion.isArchived === false
        );
        break;
      case enumCarPromotionSegments.archived:
        filteredPromotions = data.filter(
          (promotion: CarPromotion) => promotion.isArchived === true
        );
        break;
      case enumCarPromotionSegments.pinned:
        filteredPromotions = data.filter(
          (promotion: CarPromotion) =>
            promotion.isPinned === true && promotion.isArchived === false
        );
        break;
      default:
        filteredPromotions = [];
        break;
    }
    console.log("3 -----", filteredPromotions);
    setFilteredPromotions(filteredPromotions);
  };
  //RETURN COMPONENT -----------------
  return (
    <>
      <IonList inset>
        {filteredPromotions.length === 0 ? (
          <IonItem>
            <IonLabel>{text[l].empty}</IonLabel>
          </IonItem>
        ) : (
          filteredPromotions.map((car: CarPromotion, index: number) => {
            return <CarPromotionItem data={car} key={index} />;
          })
        )}
      </IonList>
      {/* ------------ */}
    </>
  );
};

export default CarPromotionList;
