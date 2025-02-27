import styles from "./GalleryHandler.module.css";
import { typeImage } from "../../types/typeImage";
import ImagesAdd from "../Images__Add/ImagesAdd";
import { typeImageUploadData } from "../../types/typeImageUploadData";
interface ContainerProps {
  imagesToUpload: File[];
  setImagesToUpload: React.Dispatch<React.SetStateAction<File[]>>;
  imageDetails: typeImageUploadData;
  setImageDetails: React.Dispatch<React.SetStateAction<typeImageUploadData>>;
}

const GalleryHandler: React.FC<ContainerProps> = ({
  imagesToUpload,
  setImagesToUpload,
  imageDetails,
  setImageDetails,
}) => {
  //VARIABLES ------------------------
  //USE STATES -----------------------
  //USE EFFECTS ----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <div className={styles.container}>
      <ImagesAdd
        selectedFiles={imagesToUpload}
        setSelectedFiles={setImagesToUpload}
        imageDetails={imageDetails}
        setImageDetails={setImageDetails}
      />
    </div>
  );
};

export default GalleryHandler;
