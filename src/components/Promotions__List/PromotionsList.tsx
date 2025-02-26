import { useContextLanguage } from "../../context/contextLanguage";
import { enumPromotions } from "../../enum/enumPromotions";
import { usePromotionsContext } from "../../context/promotions/contextPromotions";
import { IonList } from "@ionic/react";
import ItemLoading from "../Item__Loading/ItemLoading";
import ItemEmpty from "../Item__Empty/ItemEmpty";
import { typePromotion } from "../../types/typePromotion";
import { useEffect, useState } from "react";
import {
  isPromotionExpired,
  isPromotionInProgress,
  isPromotionNotStarted,
} from "../../utils/isPromotionAvailable";
import PromotionsItem from "../Promotions__Item/PromotionsItem";
interface ContainerProps {
  filter: enumPromotions;
  searchTerm: string;
}

const PromotionsList: React.FC<ContainerProps> = ({ filter, searchTerm }) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  const { statusInitPromotionData, promotionsData, initData } =
    usePromotionsContext();
  //USE STATES -----------------------
  const [filteredData, setFilteredData] = useState<typePromotion[]>([]);
  //USE EFFECTS ----------------------
  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    filterPromotions(
      promotionsData.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [filter, promotionsData, searchTerm]);

  //FUNCTIONS ------------------------
  const filterPromotions = (data: typePromotion[]) => {
    let filteredPromotions: typePromotion[] = [];
    switch (filter) {
      case enumPromotions.all:
        filteredPromotions = data.filter(
          (promotion: typePromotion) => promotion.isArchived === false
        );
        break;
      case enumPromotions.archived:
        filteredPromotions = data.filter(
          (promotion: typePromotion) => promotion.isArchived === true
        );
        break;
      case enumPromotions.pinned:
        filteredPromotions = data.filter(
          (promotion: typePromotion) =>
            promotion.isPinned === true && promotion.isArchived === false
        );
        break;
      case enumPromotions.inProgress:
        filteredPromotions = data.filter((promotion) =>
          isPromotionInProgress(promotion)
        );
        break;
      case enumPromotions.expired:
        filteredPromotions = data.filter((promotion) =>
          isPromotionExpired(promotion)
        );
        break;
      case enumPromotions.notStarted:
        filteredPromotions = data.filter((promotion) =>
          isPromotionNotStarted(promotion)
        );
        break;
      default:
        filteredPromotions = [];
        break;
    }
    setFilteredData(filteredPromotions);
  };
  //RETURN COMPONENT -----------------
  return (
    <>
      <IonList inset>
        {statusInitPromotionData.status === "loading" ? (
          <ItemLoading />
        ) : filteredData.length === 0 ? (
          <ItemEmpty />
        ) : (
          filteredData.map((car: typePromotion, index: number) => {
            return <PromotionsItem data={car} key={index} />;
          })
        )}
      </IonList>
    </>
  );
};

export default PromotionsList;
