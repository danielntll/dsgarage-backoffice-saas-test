import { CarPromotion } from "../../types/typeCarPromotion";
import CarPromotionItem from "../CarPromotion__Item/CarPromotionItem";

interface ContainerProps {
  data: CarPromotion[];
}

const DataDisplayListCarPromotion: React.FC<ContainerProps> = ({ data }) => {
  //VARIABLES ------------------------
  //USE STATES -----------------------
  //USE EFFECTS ----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return data.map((item: CarPromotion, index: number) => {
    return (
      <CarPromotionItem
        data={item}
        key={index + " DataDisplayListCarPromotion"}
      />
    );
  });
};

export default DataDisplayListCarPromotion;
