import { useCarPromotionContext } from "../../context/car promotion/contextCarPromotion";
import { IonList } from "@ionic/react";
import CarPromotionItem from "../CarPromotion__Item/CarPromotionItem";
import { CarPromotion } from "../../types/typeCarPromotion";
import { enumCarPromotionSegments } from "../../enum/enumCarPromotionSegments";
import { useEffect, useState } from "react";
import StatusData from "../Status__Data/StatusData";

interface ContainerProps {
  filter: enumCarPromotionSegments;
  searchTerm: string;
}

const CarPromotionList: React.FC<ContainerProps> = ({ filter, searchTerm }) => {
  //VARIABLES ------------------------
  const { carPromotions, initData, statusFetch } = useCarPromotionContext();
  //USE STATES -----------------------
  const [filteredPromotions, setFilteredPromotions] =
    useState<CarPromotion[]>(carPromotions);
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
        <StatusData status={statusFetch} dataLength={filteredPromotions.length}>
          {filteredPromotions.map((car: CarPromotion, index: number) => {
            return <CarPromotionItem data={car} key={index} />;
          })}
        </StatusData>
      </IonList>
    </>
  );
};

export default CarPromotionList;
