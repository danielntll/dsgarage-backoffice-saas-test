import styles from "./DemoComponent.module.css";
import { useContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { IonList } from "@ionic/react";
import ImageItem from "../Image__Item/ImageItem";
import { typeImage } from "../../types/typeImage";
import { useGalleryContext } from "../../context/gallery/contextGallery";
import { enumPageGallerySegment } from "../../enum/enumPageGallerySegment";
import { useEffect, useState } from "react";
import ItemLoading from "../Item__Loading/ItemLoading";
import ItemEmpty from "../Item__Empty/ItemEmpty";
import StatusData from "../Status__Data/StatusData";

interface ContainerProps {
  searchTerm: string;
  filter: enumPageGallerySegment;
}

const GalleryList: React.FC<ContainerProps> = ({ searchTerm, filter }) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  const { galleryData, initData, statusFetch } = useGalleryContext();
  //USE STATES -----------------------
  const [filteredData, setFilteredData] = useState<typeImage[]>(galleryData);
  //USE EFFECTS ----------------------
  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    filterData(
      galleryData.filter((item) =>
        item.alt?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [filter, galleryData, searchTerm]);
  //FUNCTIONS ------------------------
  const filterData = (data: typeImage[]) => {
    let filteredData: typeImage[] = [];
    switch (filter) {
      case enumPageGallerySegment.all:
        filteredData = data.filter(
          (promotion: typeImage) => promotion.isArchived === false
        );
        break;
      case enumPageGallerySegment.archived:
        filteredData = data.filter(
          (promotion: typeImage) => promotion.isArchived === true
        );
        break;
      case enumPageGallerySegment.pinned:
        filteredData = data.filter(
          (promotion: typeImage) =>
            promotion.isPinned === true && promotion.isArchived === false
        );
        break;
      default:
        filteredData = [];
        break;
    }
    setFilteredData(filteredData);
  };
  //RETURN COMPONENT -----------------
  return (
    <>
      <IonList inset>
        <StatusData status={statusFetch} dataLength={filteredData.length}>
          {filteredData?.map((data: typeImage, index: number) => {
            return <ImageItem image={data} key={index} />;
          })}
        </StatusData>
      </IonList>
    </>
  );
};

export default GalleryList;
