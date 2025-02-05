import { typeImage } from "../../types/typeImage";
import ImageItem from "../Image__Item/ImageItem";

interface ContainerProps {
  data: typeImage[];
}

const DataDisplayListImages: React.FC<ContainerProps> = ({ data }) => {
  //VARIABLES ------------------------
  //USE STATES -----------------------
  //USE EFFECTS ----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return data.map((item: typeImage, index: number) => {
    return <ImageItem image={item} key={index + " DataDisplayListImages"} />;
  });
};

export default DataDisplayListImages;
