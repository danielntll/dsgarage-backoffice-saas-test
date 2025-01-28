import styles from "./CarPromotionModalCreateModify.module.css";
import { useContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useCallback, useEffect, useState } from "react";
import {
  CarDetails,
  CarInfo,
  CarPromotion,
} from "../../types/typeCarPromotion";
import { useCarPromotionContext } from "../../context/car promotion/contextCarPromotion";

interface ContainerProps {
  isModalOpen: boolean;
  callbackCloseModal: () => void;
}

const CarPromotionModalCreateModify: React.FC<ContainerProps> = ({
  isModalOpen,
  callbackCloseModal,
}) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  const { addData } = useCarPromotionContext();
  //USE STATES -----------------------
  const [formIsValid, setFormIsValid] = useState(false);
  const [carInfo, setCarInfo] = useState<CarInfo>({
    model: "",
    year: 0,
    km: 0,
    price: "",
  });
  const [carDetails, setCarDetails] = useState<CarDetails>({
    shortDescription: "",
    features: [],
  });
  const [imageURLs, setImageURLs] = useState<string[]>([]);

  //USE EFFECTS ----------------------
  useEffect(() => {
    const isValid =
      carInfo.model.trim() !== "" &&
      carInfo.year > 0 &&
      carInfo.km >= 0 &&
      carInfo.price.toString().trim() !== "" &&
      carDetails.shortDescription.trim() !== "";
    setFormIsValid(isValid);
  }, [carInfo, carDetails]);
  //FUNCTIONS ------------------------
  const handleCarInfoChange = useCallback(
    (event: any) => {
      setCarInfo({
        ...carInfo,
        [event.target.name]:
          event.target.type === "number"
            ? parseInt(event.target.value, 10)
            : event.target.value,
      });
    },
    [carInfo]
  );

  const handleCarDetailsChange = useCallback(
    (event: any) => {
      setCarDetails({
        ...carDetails,
        [event.target.name]: event.target.value,
      });
    },
    [carDetails]
  );

  const handleSubmit = useCallback(async () => {
    if (!formIsValid) {
      console.error("Form is not valid. Can't submit.");
      return;
    }

    const newCarPromotion: CarPromotion = {
      carInfo: carInfo,
      carDetails: carDetails,
      imageURLs: imageURLs,
      isArchived: false,
      isPinned: false,
    };
    try {
      // await addDocument("carPromotions", newCarPromotion);
      callbackCloseModal();
    } catch (error) {
      console.error("Error adding car promotion:", error);
      // Add error handling (e.g., display an error message)
    }
  }, [callbackCloseModal, carInfo, carDetails, imageURLs, formIsValid]);

  //RETURN COMPONENT -----------------
  return (
    <IonModal isOpen={isModalOpen} onDidDismiss={callbackCloseModal}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{text[l].componentTitle}</IonTitle>
          <IonButtons slot="end">
            <IonButton type="submit" expand="block" disabled={!formIsValid}>
              Crea
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* Car Info Section */}
          <IonItem>
            <IonLabel position="stacked">Model</IonLabel>
            <IonInput
              type="text"
              name="model"
              value={carInfo.model}
              onIonChange={handleCarInfoChange}
              required
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Year</IonLabel>
            <IonInput
              type="number"
              name="year"
              value={carInfo.year}
              onIonChange={handleCarInfoChange}
              required
            />
          </IonItem>
          {/* Add other CarInfo fields similarly */}

          {/* Car Details Section */}
          <IonItem>
            <IonLabel position="stacked">Short Description</IonLabel>
            <IonTextarea
              name="shortDescription"
              value={carDetails.shortDescription}
              onIonChange={handleCarDetailsChange}
              required
            />
          </IonItem>
          {/* Add other CarDetails fields similarly */}

          {/* Image URLs Section (You'll need to implement image upload logic here) */}
          <IonItem>
            <IonLabel position="stacked">Image URLs</IonLabel>
            {/* Input fields for image URLs */}
          </IonItem>
        </form>
      </IonContent>
    </IonModal>
  );
};

export default CarPromotionModalCreateModify;
