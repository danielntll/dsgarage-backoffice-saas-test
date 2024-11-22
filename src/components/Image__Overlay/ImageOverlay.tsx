import { useContext } from "react";
import styles from "./ImageOverlay.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { typeImage } from "../../types/typeImage";

interface ContainerProps {
  showOverlay: boolean;
  overlayImage: typeImage | null;
  closeOverlay: () => void;
}

const ImageOverlay: React.FC<ContainerProps> = ({
  showOverlay,
  overlayImage,
  closeOverlay,
}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  return (
    <div className={styles.container}>
      {showOverlay && (
        <div className={styles.overlay} onClick={closeOverlay}>
          <div className={styles.overlayContent}>
            <img
              src={overlayImage?.imageUrl}
              alt="Overlay"
              style={{ maxWidth: "90vw", maxHeight: "90vh" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageOverlay;
