import { useContextLanguage } from "../../context/contextLanguage";
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
  IonListHeader,
  IonModal,
  IonSpinner,
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
import { add, removeCircleOutline } from "ionicons/icons";
import GalleryHandler from "../Gallery__Handler/GalleryHandler";
import { typeImageUploadData } from "../../types/typeImageUploadData";
import { typeImageSimple } from "../../types/typeImageSimple";

interface ContainerProps {
  isModalOpen: boolean;
  callbackCloseModal: () => void;
  elementToModify: CarPromotion | null;
}

const CarPromotionModalCreateModify: React.FC<ContainerProps> = ({
  isModalOpen,
  callbackCloseModal,
  elementToModify,
}) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  const { addData, updateInfo } = useCarPromotionContext();
  //USE STATES -----------------------
  const [formIsValid, setFormIsValid] = useState(elementToModify != null);
  const [carInfo, setCarInfo] = useState<CarInfo>(
    elementToModify?.carInfo ?? {}
  );
  const [carDetails, setCarDetails] = useState<CarDetails>(
    elementToModify?.carDetails ?? {
      features: [],
    }
  );
  const [images, setImages] = useState<typeImageSimple[]>(
    elementToModify?.images ?? []
  );

  const [featureInput, setFeatureInput] = useState(""); //State for the feature input
  const [imagesToUpload, setImagesToUpload] = useState<File[]>([]);
  const [imageDetails, setImageDetails] = useState<typeImageUploadData>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //USE EFFECTS ----------------------
  useEffect(() => {
    setFormIsValid(
      carInfo && carDetails && (images.length > 0 || imagesToUpload.length > 0)
    );
  }, [carInfo, carDetails, images, imagesToUpload]);

  useEffect(() => {
    if (elementToModify) {
      setCarInfo(elementToModify.carInfo);
      setCarDetails(elementToModify.carDetails);
      setImages(elementToModify.images);
      setFormIsValid(true);
    }
  }, [elementToModify]);
  //FUNCTIONS ------------------------

  // ------ handleAddFeature
  const handleAddFeature = useCallback(() => {
    if (featureInput.trim() !== "") {
      setCarDetails((prevDetails) => ({
        ...prevDetails,
        features: [...(prevDetails?.features ?? []), featureInput.trim()],
      }));
      setFeatureInput(""); // Clear the input field after adding
    }
  }, [featureInput, setCarDetails]);

  const handleRemoveFeature = useCallback(
    (index: number) => {
      setCarDetails((prevDetails) => ({
        ...prevDetails,
        features: prevDetails?.features?.filter((_, i) => i !== index),
      }));
    },
    [setCarDetails]
  );

  // ------- handleFeatureInputChange
  const handleFeatureInputChange = useCallback(
    (event: any) => {
      setFeatureInput(event.target.value); // Update featureInput state
    },
    [setFeatureInput]
  );

  // -------- handleCarInfoChange
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

  // --------- handleCarDetailsChange
  const handleCarDetailsChange = useCallback(
    (event: any) => {
      setCarDetails({
        ...carDetails,
        [event.target.name]: event.target.value,
      });
    },
    [carDetails]
  );

  // --------- handleSubmit
  const handleSubmit = useCallback(async () => {
    setIsLoading(true);

    const newCarPromotion: CarPromotion = {
      carInfo: carInfo,
      carDetails: carDetails,
      images: elementToModify?.images ?? [],
    };
    try {
      if (elementToModify) {
        await updateInfo(elementToModify.uid!, newCarPromotion, imagesToUpload);
      } else {
        await addData(newCarPromotion, imagesToUpload);
      }

      closeModal();
    } catch (error) {
      console.error("Error adding car promotion:", error);
    }
    setIsLoading(false);
  }, [callbackCloseModal, carInfo, carDetails, images, formIsValid]);

  // --------- resetAll
  const resetAll = useCallback(() => {
    setCarInfo({});
    setCarDetails({ features: [] });
    setFeatureInput("");
    setImages([]);
    setImagesToUpload([]);
    setImageDetails({});
    setFormIsValid(false);
  }, [
    setCarInfo,
    setCarDetails,
    setFeatureInput,
    setImages,
    setImagesToUpload,
    setImageDetails,
    setFormIsValid,
  ]);

  // ---------- closeModal
  const closeModal = () => {
    callbackCloseModal();
    resetAll();
  };

  //RETURN COMPONENT -----------------
  return (
    <IonModal isOpen={isModalOpen} onDidDismiss={closeModal}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color={"medium"} onClick={closeModal}>
              Chiudi
            </IonButton>
          </IonButtons>
          <IonTitle>
            {elementToModify != null
              ? text[l].modify.title
              : text[l].create.title}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={handleSubmit}
              type="submit"
              expand="block"
              disabled={!formIsValid || isLoading}
            >
              {isLoading && <IonSpinner />}
              {elementToModify != null
                ? text[l].modify.button
                : text[l].create.button}
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
          <IonList inset>
            <IonListHeader>
              <IonLabel>
                <p>Informazioni</p>
              </IonLabel>
            </IonListHeader>

            <IonItem>
              <IonInput
                placeholder="Modello"
                labelPlacement="stacked"
                label="Modello"
                type="text"
                name="model"
                value={carInfo.model}
                onIonChange={handleCarInfoChange}
                required
              />
            </IonItem>
            <IonItem>
              <IonInput
                placeholder="Anno"
                labelPlacement="stacked"
                label="Anno"
                type="number"
                name="year"
                value={carInfo.year}
                onIonChange={handleCarInfoChange}
                required
              />
            </IonItem>
            <IonItem>
              <IonInput
                placeholder="Km"
                labelPlacement="stacked"
                label="Km"
                type="number"
                name="km"
                value={carInfo.km}
                onIonChange={handleCarInfoChange}
                required
              />
            </IonItem>

            <IonItem>
              <IonInput
                placeholder="Prezzo"
                labelPlacement="stacked"
                label="Prezzo"
                type="text"
                name="price"
                value={carInfo.price}
                onIonChange={handleCarInfoChange}
                required
              />
            </IonItem>
          </IonList>
          <IonList inset>
            <IonListHeader>
              <IonLabel>
                <p>Dettagli</p>
              </IonLabel>
            </IonListHeader>
            <IonItem>
              <IonTextarea
                placeholder="Descrizione breve"
                labelPlacement="stacked"
                label="Descrizione breve"
                name="shortDescription"
                value={carDetails.shortDescription}
                onIonChange={handleCarDetailsChange}
                required
              />
            </IonItem>
          </IonList>
          <IonList inset>
            <IonListHeader>
              <IonLabel>
                <p>Caratteristiche</p>
              </IonLabel>
            </IonListHeader>
            <IonItem>
              <IonInput
                placeholder="Caratteristica"
                labelPlacement="stacked"
                label="Caratteristica"
                type="text"
                name="features"
                value={featureInput}
                onIonChange={handleFeatureInputChange}
                required
              />
              <IonButton onClick={handleAddFeature}>
                <IonIcon icon={add} />
              </IonButton>
            </IonItem>
            {carDetails?.features?.map((feature, index) => (
              <IonItem key={index}>
                <IonLabel>{feature}</IonLabel>
                <IonButton
                  fill="clear"
                  color={"danger"}
                  onClick={() => handleRemoveFeature(index)}
                >
                  <IonIcon icon={removeCircleOutline} />
                </IonButton>
              </IonItem>
            ))}
          </IonList>

          <IonList inset>
            <IonListHeader>
              <IonLabel>
                <p>Immagini</p>
              </IonLabel>
            </IonListHeader>
            <GalleryHandler
              imagesToUpload={imagesToUpload}
              setImagesToUpload={setImagesToUpload}
              imageDetails={imageDetails}
              setImageDetails={setImageDetails}
            />
          </IonList>
        </form>
      </IonContent>
    </IonModal>
  );
};

export default CarPromotionModalCreateModify;
