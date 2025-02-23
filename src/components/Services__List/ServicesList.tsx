import styles from "./ServicesList.module.css";
import { useContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { enumServices } from "../../enum/enumServices";
import { typeService } from "../../types/typeService";
import { useEffect, useState } from "react";
import { useServicesContext } from "../../context/services/contextServices";
import { IonList } from "@ionic/react";
import ItemLoading from "../Item__Loading/ItemLoading";
import ItemEmpty from "../Item__Empty/ItemEmpty";
import ServicesItem from "../Services__Item/ServicesItem";
interface ContainerProps {
  filter: enumServices;
  searchTerm: string;
}

const ServicesList: React.FC<ContainerProps> = ({ filter, searchTerm }) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  const { fetchServices, services, loadingServices } = useServicesContext();
  //USE STATES -----------------------
  const [filteredData, setFilteredData] = useState<typeService[]>([]);
  //USE EFFECTS ----------------------
  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterData(
      services.filter((item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [filter, services, searchTerm]);
  //FUNCTIONS ------------------------
  const filterData = (data: typeService[]) => {
    let auxFilteredData: typeService[] = [];
    switch (filter) {
      case enumServices.all:
        auxFilteredData = data.filter(
          (promotion: typeService) => promotion.isArchived === false
        );
        break;
      case enumServices.archived:
        auxFilteredData = data.filter(
          (promotion: typeService) => promotion.isArchived === true
        );
        break;
      case enumServices.pinned:
        auxFilteredData = data.filter(
          (promotion: typeService) =>
            promotion.isPinned === true && promotion.isArchived === false
        );
        break;
      default:
        auxFilteredData = [];
        break;
    }
    setFilteredData(auxFilteredData);
  };
  //RETURN COMPONENT -----------------
  return (
    <>
      <IonList inset>
        {loadingServices ? (
          <ItemLoading />
        ) : filteredData.length === 0 ? (
          <ItemEmpty />
        ) : (
          filteredData.map((item: typeService, index: number) => {
            return <ServicesItem data={item} key={index} />;
          })
        )}
      </IonList>
    </>
  );
};

export default ServicesList;
