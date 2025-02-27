import { useContext } from "react";
import styles from "./ImageButtonVisibility.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { IonButton, IonIcon } from "@ionic/react";
import { useGalleryContext } from "../../context/gallery/contextGallery";
import { typeImage } from "../../types/typeImage";
import { eye, eyeOffOutline } from "ionicons/icons";
import { useContextToast } from "../../context/systemEvents/contextToast";

interface ContainerProps {
  image: typeImage | null;
  props?: any;
  onlyIcon?: boolean;
}

const ImageButtonVisibility: React.FC<ContainerProps> = ({
  image,
  props,
  onlyIcon = false,
}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { toast } = useContextToast();
  const { toggleVisibilityImage } = useGalleryContext();
  //CONDITIONS -----------------------
  //FUNCTIONS ------------------------
  const onClick = () => {
    if (image) {
      toggleVisibilityImage(image);
    } else {
      toast("warning", text[l].alert);
    }
  };
  //RETURN COMPONENT -----------------
  return (
    <IonButton
      fill={image!.isArchived ? "solid" : "outline"}
      onClick={onClick}
      size="small"
      expand="block"
      {...props}
    >
      <IonIcon
        className="ion-margin-end"
        icon={image!.isArchived ? eye : eyeOffOutline}
      />
      {onlyIcon
        ? null
        : image!.isArchived
        ? text[l].not_active
        : text[l].active}
    </IonButton>
  );
};

export default ImageButtonVisibility;
