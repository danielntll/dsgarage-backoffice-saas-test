import styles from "./ServicesList.module.css";
import { useContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { enumServices } from "../../enum/enumServices";
import { typeService } from "../../types/typeService";
interface ContainerProps {
  filter: enumServices;
  searchTerm: string;
}

const ServicesList: React.FC<ContainerProps> = ({ filter, searchTerm }) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  //USE STATES -----------------------
  //USE EFFECTS ----------------------
  //FUNCTIONS ------------------------
  const filterPromotions = (data: typeService[]) => {
    let filteredPromotions: typeService[] = [];
    switch (filter) {
      case enumServices.all:
        filteredPromotions = data.filter(
          (promotion: typeService) => promotion.isArchived === false
        );
        break;
      case enumServices.archived:
        filteredPromotions = data.filter(
          (promotion: typeService) => promotion.isArchived === true
        );
        break;
      case enumServices.pinned:
        filteredPromotions = data.filter(
          (promotion: typeService) =>
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
    <div className={styles.container}>
      <p>{text[l].componentTitle}</p>
    </div>
  );
};

export default ServicesList;
