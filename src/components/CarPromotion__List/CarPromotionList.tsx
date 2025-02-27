import { useCarPromotionContext } from "../../context/car promotion/contextCarPromotion";
import { IonList } from "@ionic/react";
import CarPromotionItem from "../CarPromotion__Item/CarPromotionItem";
import { CarPromotion } from "../../types/typeCarPromotion";
import { enumCarPromotionSegments } from "../../enum/enumCarPromotionSegments";
import { useEffect, useState } from "react";
import ItemLoading from "../Item__Loading/ItemLoading";
import ItemEmpty from "../Item__Empty/ItemEmpty";

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
      carPromotions
      // carPromotions.filter((item) =>
      //   item.carInfo.model?.toLowerCase().includes(searchTerm.toLowerCase())
      // )
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
        {statusFetch.status === "loading" ? (
          <ItemLoading />
        ) : filteredPromotions.length === 0 ? (
          <ItemEmpty />
        ) : (
          filteredPromotions.map((car: CarPromotion, index: number) => {
            return <CarPromotionItem data={car} key={index} />;
          })
        )}
      </IonList>
    </>
  );
};

export default CarPromotionList;
