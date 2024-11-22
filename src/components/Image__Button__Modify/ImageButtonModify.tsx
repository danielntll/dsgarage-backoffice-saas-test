import { useContext } from "react";
import styles from "./ImageButtonModify.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { IonButton, IonIcon } from "@ionic/react";
import { useGalleryContext } from "../../context/gallery/contextGallery";
import { typeImage } from "../../types/typeImage";
import { pencilOutline } from "ionicons/icons";
import { useContextToast } from "../../context/contextToast";

interface ContainerProps {
  image: typeImage | null;
  props?: any;
}

const ImageButtonModify: React.FC<ContainerProps> = ({ image, props }) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { toast } = useContextToast();
  const { handleEditClick } = useGalleryContext();
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  const onClick = () => {
    if (image) {
      handleEditClick(image);
    } else {
      toast("warning", text[l].alert);
    }
  };
  //RETURN COMPONENT -----------------
  return (
    <IonButton
      fill={"clear"}
      onClick={onClick}
      size="small"
      {...props}
      expand="block"
    >
      <IonIcon className="ion-margin-end" icon={pencilOutline} />
      {text[l].text}
    </IonButton>
  );
};

export default ImageButtonModify;
