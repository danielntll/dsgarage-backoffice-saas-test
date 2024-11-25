import { useContext } from "react";
import styles from "./ImageButtonModify.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { IonButton, IonIcon } from "@ionic/react";
import { useGalleryContext } from "../../context/gallery/contextGallery";
import { typeImage } from "../../types/typeImage";
import { pencilOutline } from "ionicons/icons";
import { useContextToast } from "../../context/systemEvents/contextToast";

interface ContainerProps {
  image: typeImage | null;
  props?: any;
  fill?: "default" | "clear" | "outline" | "solid" | undefined;
  onlyIcon?: boolean;
}

const ImageButtonModify: React.FC<ContainerProps> = ({
  image,
  props,
  fill = "clear",
  onlyIcon = false,
}) => {
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
      fill={fill}
      onClick={onClick}
      size="small"
      {...props}
      expand="block"
    >
      <IonIcon className="ion-margin-end" icon={pencilOutline} />
      {onlyIcon ? null : text[l].text}
    </IonButton>
  );
};

export default ImageButtonModify;
