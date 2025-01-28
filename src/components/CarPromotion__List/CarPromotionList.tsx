import styles from "./CarPromotionList.module.css";
import { useContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { useCarPromotionContext } from "../../context/car promotion/contextCarPromotion";
import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
} from "@ionic/react";
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
    console.log("Filter");
    filterPromotions();
  }, [filter, carPromotions]);
  //USE STATES -----------------------
  const [filteredPromotions, setFilteredPromotions] =
    useState<CarPromotion[]>(carPromotions);
  //FUNCTIONS ------------------------
  const filterPromotions = useCallback(() => {
    let filteredPromotions: CarPromotion[] = [];
    switch (filter) {
      case enumCarPromotionSegments.all:
        filteredPromotions = carPromotions.filter(
          (promotion: CarPromotion) => promotion.isArchived === false
        );
        break;
      case enumCarPromotionSegments.archived:
        filteredPromotions = carPromotions.filter(
          (promotion: CarPromotion) => promotion.isArchived === true
        );
        break;
      case enumCarPromotionSegments.pinned:
        filteredPromotions = carPromotions.filter(
          (promotion: CarPromotion) =>
            promotion.isPinned === true && promotion.isArchived === false
        );
        break;
      default:
        filteredPromotions = [];
        break;
    }
    setFilteredPromotions(filteredPromotions);
  }, [filter, carPromotions]);
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
