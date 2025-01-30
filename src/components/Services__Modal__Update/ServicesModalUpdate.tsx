import { useContext, useEffect, useState } from "react";
import styles from "./ServicesModalUpdate.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTextarea,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { typeService } from "../../types/typeService";
import { useServicesContext } from "../../context/services/contextServices";

interface ContainerProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  serviceToUpdate?: typeService;
}

const ServicesModalUpdate: React.FC<ContainerProps> = ({
  showModal,
  setShowModal,
  serviceToUpdate,
}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { updateService } = useServicesContext();
  //CONDITIONS -----------------------
  const [updatedService, setUpdatedService] = useState<typeService>(
    serviceToUpdate ?? emptyService
  );
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined
  );
  const [isValid, setIsValid] = useState(false);
  //FUNCTIONS ------------------------
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setUpdatedService((prevService) => ({ ...prevService, [name]: value }));
    setIsValid(
      updatedService.title !== "" &&
        updatedService.subtitle !== "" &&
        updatedService.description !== ""
    );
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setIsValid(true);
  };

  const handleUpdateService = async () => {
    try {
      await updateService(updatedService, selectedImage);
      setShowModal(false);
      setSelectedImage(undefined);
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  useEffect(() => {
    if (serviceToUpdate != undefined) {
      setUpdatedService(serviceToUpdate);
    }
  }, [serviceToUpdate]);

  //RETURN COMPONENT -----------------
  return (
    <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
      <IonHeader>
        <IonToolbar>
          <IonButtons>
            <IonButton
              color="medium"
              onClick={() => {
                setShowModal(false);
                setSelectedImage(undefined);
              }}
            >
              {text[l].btn__close}
            </IonButton>
          </IonButtons>
          <IonTitle>{text[l].new_service_modal_title}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleUpdateService} disabled={!isValid}>
              {text[l].btn__update}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList inset>
          <IonItem>
            <IonLabel position="stacked">
              {text[l].service_title_label}
            </IonLabel>
            <IonInput
              name="title"
              placeholder={text[l].service_title_placeholder}
              value={updatedService.title}
              onIonInput={handleInputChange}
            />
          </IonItem>
        </IonList>
        <IonList inset>
          <IonItem>
            <IonLabel position="stacked">
              {text[l].service_subtitle_label}
            </IonLabel>
            <IonInput
              name="subtitle"
              placeholder={text[l].service_subtitle_placeholder}
              value={updatedService.subtitle}
              onIonInput={handleInputChange}
            />
          </IonItem>
        </IonList>
        <IonList inset>
          <IonItem>
            <IonLabel position="stacked">
              {text[l].service_description_label}
            </IonLabel>
            <IonTextarea
              name="description"
              rows={4}
              placeholder={text[l].service_description_placeholder}
              value={updatedService.description}
              onIonInput={handleInputChange}
            />
          </IonItem>
        </IonList>
        <IonList inset>
          <IonItem>
            <IonThumbnail className="ion-margin">
              <img src={updatedService.imageUrl} alt="" />
            </IonThumbnail>
            <IonLabel>
              <p>{text[l].image__label__selected}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>{text[l].image__label}</IonLabel>
            <input type="file" onChange={handleImageChange} />
          </IonItem>
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default ServicesModalUpdate;

const emptyService: typeService = {
  uid: "",
  imageUrl: "",
  title: "",
  subtitle: "",
  description: "",
};
