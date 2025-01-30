import styles from "./CarPromotionList.module.css";
import { useContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { useCarPromotionContext } from "../../context/car promotion/contextCarPromotion";
import { IonItem, IonLabel, IonList } from "@ionic/react";
import CarPromotionItem from "../CarPromotion__Item/CarPromotionItem";
import { CarPromotion } from "../../types/typeCarPromotion";
import { enumCarPromotionSegments } from "../../enum/enumCarPromotionSegments";
import { useEffect, useState } from "react";

interface ContainerProps {
  filter: enumCarPromotionSegments;
  searchTerm: string;
}

const CarPromotionList: React.FC<ContainerProps> = ({ filter, searchTerm }) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  const { carPromotions, initData, isLoading } = useCarPromotionContext();
  // USE EFFECTS----------------------
  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    filterPromotions(
      carPromotions.filter((item) =>
        item.carInfo.model?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [filter, carPromotions, searchTerm]);

  //USE STATES -----------------------
  const [filteredPromotions, setFilteredPromotions] =
    useState<CarPromotion[]>(carPromotions);
  //FUNCTIONS ------------------------
  const filterPromotions = (data: CarPromotion[]) => {
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
    setFilteredPromotions(filteredPromotions);
  };
  //RETURN COMPONENT -----------------
  return (
    <>
      <IonList inset>
        {isLoading ? (
          <IonItem>
            <IonLabel color={"warning"}>{text[l].loading}</IonLabel>
          </IonItem>
        ) : filteredPromotions.length === 0 ? (
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
