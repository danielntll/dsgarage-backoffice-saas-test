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

interface ContainerProps {
  searchTerm: string;
  filter: enumPageGallerySegment;
}

const GalleryList: React.FC<ContainerProps> = ({ searchTerm, filter }) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  const { galleryData, loading: isLoading } = useGalleryContext();
  //USE STATES -----------------------
  const [filteredData, setFilteredData] = useState<typeImage[] | null>(
    galleryData
  );
  //USE EFFECTS ----------------------
  useEffect(() => {
    if (galleryData !== null) {
      setFilteredData(
        galleryData.filter((item) =>
          item.alt?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [filter, galleryData, searchTerm]);
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <>
      <IonList inset>
        {isLoading ? (
          <ItemLoading />
        ) : filteredData?.length === 0 ? (
          <ItemEmpty />
        ) : (
          filteredData?.map((data: typeImage, index: number) => {
            return <ImageItem image={data} key={index} />;
          })
        )}
      </IonList>
    </>
  );
};

export default GalleryList;
