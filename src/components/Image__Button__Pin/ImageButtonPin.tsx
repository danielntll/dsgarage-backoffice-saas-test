import { useContext } from "react";
import styles from "./ImageButtonPin.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { IonButton, IonIcon } from "@ionic/react";
import { useGalleryContext } from "../../context/gallery/contextGallery";
import { typeImage } from "../../types/typeImage";
import { star, starOutline } from "ionicons/icons";
import { useContextToast } from "../../context/systemEvents/contextToast";

interface ContainerProps {
  image: typeImage | null;
  props?: any;
  onlyIcon?: boolean;
}

const ImageButtonPin: React.FC<ContainerProps> = ({
  image,
  props,
  onlyIcon = false,
}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { toast } = useContextToast();
  const { togglePinImage } = useGalleryContext();
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  const onClick = () => {
    if (image) {
      togglePinImage(image);
    } else {
      toast("warning", text[l].alert);
    }
  };
  //RETURN COMPONENT -----------------
  return (
    <IonButton
      fill={image!.isPinned ? "solid" : "outline"}
      onClick={onClick}
      size="small"
      expand="block"
      {...props}
    >
      <IonIcon
        className="ion-margin-end"
        icon={image!.isPinned ? star : starOutline}
      />
      {onlyIcon ? null : image!.isPinned ? text[l].not_active : text[l].active}
    </IonButton>
  );
};

export default ImageButtonPin;
