import { useContext } from "react";
import styles from "./ImageButtonDelete.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { IonButton, IonIcon } from "@ionic/react";
import { useGalleryContext } from "../../context/gallery/contextGallery";
import { typeImage } from "../../types/typeImage";
import { trashBinOutline } from "ionicons/icons";
import { useContextToast } from "../../context/systemEvents/contextToast";

interface ContainerProps {
  image: typeImage | null;
  props?: any;
  fill?: "default" | "clear" | "outline" | "solid" | undefined;
  onlyIcon?: boolean;
}

const ImageButtonDelete: React.FC<ContainerProps> = ({
  image,
  props,
  fill = "clear",
  onlyIcon = false,
}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { toast } = useContextToast();
  const { handleDeleteImage } = useGalleryContext();
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  const onClick = () => {
    if (image) {
      handleDeleteImage(image);
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
      color={"danger"}
      expand="block"
      {...props}
    >
      <IonIcon className="ion-margin-end" icon={trashBinOutline} />
      {onlyIcon ? null : text[l].text}
    </IonButton>
  );
};

export default ImageButtonDelete;
