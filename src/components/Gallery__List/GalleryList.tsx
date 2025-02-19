import styles from "./DemoComponent.module.css";
import { useContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import {
  IonButton,
  IonIcon,
  IonLabel,
  IonList,
  IonListHeader,
} from "@ionic/react";
import ImageItem from "../Image__Item/ImageItem";
import { typeImage } from "../../types/typeImage";
import { useGalleryContext } from "../../context/gallery/contextGallery";
import { enumPageGallerySegment } from "../../enum/enumPageGallerySegment";
import { useEffect, useState } from "react";
import ItemLoading from "../Item__Loading/ItemLoading";
import ItemEmpty from "../Item__Empty/ItemEmpty";
import { downloadOutline } from "ionicons/icons";
import GalleryButtonLoadMore from "../Gallery__Button__LoadMore/GalleryButtonLoadMore";

interface ContainerProps {
  searchTerm: string;
  filter: enumPageGallerySegment;
}

const GalleryList: React.FC<ContainerProps> = ({ searchTerm, filter }) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  const { initState, galleryData, loading } = useGalleryContext();
  //USE STATES -----------------------
  const [filteredData, setFilteredData] = useState<typeImage[] | null>(
    galleryData
  );
  //USE EFFECTS ----------------------
  useEffect(() => {
    console.log("useEffect GalleryList");
    initState();
  }, []);

  useEffect(() => {
    if (galleryData !== null) {
      let filtered = galleryData.filter((item) =>
        item.alt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      switch (filter) {
        case enumPageGallerySegment.pinned:
          filtered = filtered.filter((item) => item.isPinned === true);
          break;
        case enumPageGallerySegment.archived:
          filtered = filtered.filter((item) => item.isArchived === true);
          break;
        default:
          filtered = filtered.filter((item) => item.isArchived === false);
          break;
      }

      setFilteredData(filtered);
    }
  }, [filter, galleryData, searchTerm]);
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <>
      <IonList inset>
        <IonListHeader>
          <IonLabel>
            <p>
              {text[l].img_available}: {filteredData?.length || 0}
            </p>
          </IonLabel>
        </IonListHeader>
        {loading ? (
          <ItemLoading />
        ) : filteredData?.length === 0 ? (
          <ItemEmpty />
        ) : (
          filteredData?.map((data: typeImage, index: number) => {
            return <ImageItem image={data} key={index} />;
          })
        )}
      </IonList>
      <GalleryButtonLoadMore />
    </>
  );
};

export default GalleryList;
