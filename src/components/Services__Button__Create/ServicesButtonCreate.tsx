import { useContext, useState } from "react";
import styles from "./ServicesButtonCreate.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { useServicesContext } from "../../context/services/contextServices";
import { typeService } from "../../types/typeService";

interface ContainerProps {
  onlyIcon?: boolean;
}

const ServicesButtonCreate: React.FC<ContainerProps> = ({ onlyIcon }) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { createService } = useServicesContext();
  //CONDITIONS -----------------------
  const [showModal, setShowModal] = useState(false);
  const [newService, setNewService] = useState<typeService>(emptyService);
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined
  );
  const [isValid, setIsValid] = useState(false);
  //FUNCTIONS ------------------------
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewService((prevService) => ({ ...prevService, [name]: value }));
    setIsValid(
      newService.title !== "" &&
        newService.subtitle !== "" &&
        newService.description !== ""
    );
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setIsValid(
      newService.title !== "" &&
        newService.subtitle !== "" &&
        newService.description !== "" &&
        !!file
    );
  };

  const handleCreate = async () => {
    try {
      await createService(newService, selectedImage);
      setNewService(emptyService);
      setSelectedImage(undefined);
      setShowModal(false);
    } catch (error) {
      console.error("Error in handleCreate:", error);
    }
  };

  //RETURN COMPONENT -----------------
  return (
    <>
      <IonButton onClick={() => setShowModal(true)}>
        {text[l].btn__create}
        <IonIcon icon={addOutline} />
      </IonButton>

      {/* ------------ MODALE ------------ */}
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonButtons>
              <IonButton
                color="medium"
                onClick={() => {
                  setShowModal(false);
                  setNewService(emptyService);
                  setSelectedImage(undefined);
                }}
              >
                {text[l].btn__close}
              </IonButton>
            </IonButtons>
            <IonTitle>{text[l].new_service_modal_title}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={handleCreate} disabled={!isValid}>
                {text[l].btn__create}
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
                value={newService.title}
                onIonChange={handleInputChange}
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
                value={newService.subtitle}
                onIonChange={handleInputChange}
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
                value={newService.description}
                onIonChange={handleInputChange}
              />
            </IonItem>
          </IonList>
          <IonList inset>
            <IonItem>
              <IonLabel>{text[l].image__label}</IonLabel>
              <input type="file" onChange={handleImageChange} />
            </IonItem>
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );
};

export default ServicesButtonCreate;

const emptyService: typeService = {
  uid: "",
  imageUrl: "",
  title: "",
  subtitle: "",
  description: "",
};
