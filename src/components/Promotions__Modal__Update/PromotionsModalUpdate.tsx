import { useContext, useEffect, useState } from "react";
import styles from "./PromotionsModalUpdate.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { typePromotion } from "../../types/typeTarghet";
import { Timestamp } from "firebase/firestore";
import { usePromotionsContext } from "../../context/promotions/contextPromotions";
import { useServicesContext } from "../../context/services/contextServices";
import { ContextToast } from "../../context/systemEvents/contextToast";
import { typeService } from "../../types/typeService";
import { addOutline } from "ionicons/icons";
import { typeModePromotionModal } from "../../types/typePromotionModal";

interface ContainerProps {
  showModal: boolean;
  setShowModal: () => void;
  type: typeModePromotionModal;
  promotionToUpdate?: typePromotion;
}

const PromotionsModalUpdate: React.FC<ContainerProps> = ({
  showModal,
  setShowModal,
  type,
  promotionToUpdate,
}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const {
    handleCreatePromotion,
    handleAddTarget,
    targets,
    handleEditPromotion,
  } = usePromotionsContext();
  const { services } = useServicesContext();
  const { toast } = useContext(ContextToast);
  //CONDITIONS -----------------------
  const [isValid, setIsValid] = useState<boolean>(false);
  const [promotionSelected, setPromotionSelected] = useState<typePromotion>(
    promotionToUpdate ?? emptyValue
  );

  const [targetSelected, setTargetSelected] = useState<string>("");
  const [showNewTargetInput, setShowNewTargetInput] = useState<boolean>(false);

  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined
  );

  //EFFECTS --------------------------
  useEffect(() => {
    if (promotionToUpdate) {
      setPromotionSelected(promotionToUpdate);
    }
  }, [promotionToUpdate]);
  //FUNCTIONS ------------------------

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "startAt" || name === "endAt") {
      setPromotionSelected({
        ...promotionSelected,
        [name]: Timestamp.fromDate(new Date(value)),
      });
    } else {
      setPromotionSelected({ ...promotionSelected, [name]: value });
    }

    if (type == "create") {
      setIsValid(
        promotionSelected.title !== "" &&
          promotionSelected.description !== "" &&
          promotionSelected.category !== "" &&
          promotionSelected.target !== ""
      );
    } else {
      setIsValid(true);
    }
  };

  const handleSubmit = () => {
    if (type == "create") {
      handleCreatePromotion(promotionSelected, selectedImage);
    } else {
      handleEditPromotion(promotionSelected, selectedImage);
    }
    setPromotionSelected(emptyValue);
    setShowModal();
  };

  const addTarget = async () => {
    if (targetSelected.trim() !== "") {
      try {
        await handleAddTarget(targetSelected);

        setPromotionSelected((prev) => ({
          ...prev,
          target: targetSelected,
        }));
        if (type == "create") {
          setIsValid(
            promotionSelected.title !== "" &&
              promotionSelected.description !== "" &&
              promotionSelected.category !== ""
          );
        } else {
          setIsValid(true);
        }

        setShowNewTargetInput(false);
      } catch (error) {
        console.error("Error adding target:", error);
        toast("danger", text[l].error_create_target);
      }
    } else {
      toast("danger", text[l].error_target_empty);
    }
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setIsValid(true);
  };

  const handleSelectTarget = (e: string) => {
    setTargetSelected(e);
    if (type == "create") {
      setIsValid(
        promotionSelected.title !== "" &&
          promotionSelected.description !== "" &&
          promotionSelected.category !== ""
      );
    } else {
      setIsValid(true);
    }
  };

  //RETURN COMPONENT -----------------
  return (
    <IonModal isOpen={showModal} onDidDismiss={() => setShowModal()}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => setShowModal()}>
              {text[l].btn__cancel}
            </IonButton>
          </IonButtons>
          <IonTitle>
            {type == "create"
              ? text[l].new__promotion
              : text[l].update__promotion}
          </IonTitle>
          <IonButtons slot="end">
            <IonButton
              disabled={!isValid} // Disable if not valid
              onClick={() => {
                handleSubmit();
              }}
            >
              {type == "create" ? text[l].btn__create : text[l].btn__update}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* -------------- TITOLO ---------- */}
        <IonList inset>
          <IonItem>
            <IonInput
              label={text[l].title__label}
              name="title"
              labelPlacement="stacked"
              placeholder={text[l].title__placeholder}
              value={promotionSelected.title}
              onIonInput={handleInputChange}
            />
          </IonItem>

          {/* -------------- DESCRIZIONE ---------- */}
          <IonItem>
            <IonTextarea
              label={text[l].description__label}
              name="description"
              labelPlacement="stacked"
              placeholder={text[l].description__placeholdert}
              value={promotionSelected.description}
              onIonInput={handleInputChange}
              rows={4}
            />
          </IonItem>
        </IonList>

        <IonLabel>
          <p className="ion-padding-horizontal">{text[l].info__title}</p>
        </IonLabel>

        {/* -------------- CATEGORIA/SERVIZIO ---------- */}

        <IonList inset>
          <IonItem>
            <IonSelect
              label={text[l].category__label}
              name="category"
              value={promotionSelected.category}
              onIonChange={handleInputChange}
              interface="alert"
              cancelText={text[l].btn__cancel}
            >
              {services.map((service: typeService, index: number) => (
                <IonSelectOption key={service.uid} value={service.title}>
                  {service.title}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </IonList>

        <IonLabel>
          <p className="ion-padding-horizontal">{text[l].info__category}</p>
        </IonLabel>

        {/* -------------- IMMAGINE COPERTINA ---------- */}
        <IonList inset>
          <IonItem>
            <IonLabel>{text[l].image__label}</IonLabel>
            <input type="file" onChange={handleImageChange} />
          </IonItem>
        </IonList>

        <IonLabel>
          <p className="ion-padding-horizontal">{text[l].image__description}</p>
        </IonLabel>

        {/* -------------- TARGET ---------- */}
        <IonList inset>
          <IonItem>
            <IonSelect
              label={text[l].target__label}
              name="target"
              value={promotionSelected.target}
              onIonChange={handleInputChange}
              interface="alert"
              cancelText={text[l].btn__cancel}
            >
              {targets.map((target, index) => (
                <IonSelectOption key={target + index + type} value={target}>
                  {target}
                </IonSelectOption>
              ))}
            </IonSelect>
            <IonButton
              className="ion-margin-start"
              slot="end"
              onClick={() => setShowNewTargetInput(!showNewTargetInput)}
            >
              <IonIcon icon={addOutline} />
            </IonButton>
          </IonItem>
        </IonList>
        {showNewTargetInput && (
          <IonList inset>
            <IonItem>
              <IonInput
                label={text[l].target__new}
                value={targetSelected}
                labelPlacement="stacked"
                placeholder={text[l].target__placeholder}
                onIonInput={(e) => handleSelectTarget(e.detail.value!)}
              />
              <IonButton slot="end" onClick={addTarget}>
                {text[l].btn__add}
              </IonButton>
            </IonItem>
          </IonList>
        )}
        <IonLabel>
          <p className="ion-padding-horizontal">{text[l].info__target}</p>
        </IonLabel>

        {/* -------------- DATA INIZIO ---------- */}

        <IonList inset>
          <IonItem>
            <IonLabel position="stacked">{text[l].startAt__label}</IonLabel>
            <IonDatetime
              name="startAt"
              value={promotionSelected.startAt.toDate().toISOString()}
              onIonChange={handleInputChange}
              presentation="date"
            />
          </IonItem>
        </IonList>
        {/* -------------- DATA FINE ---------- */}

        <IonList inset>
          <IonItem>
            <IonLabel position="stacked">{text[l].endAt__label}</IonLabel>
            <IonDatetime
              name="endAt"
              value={promotionSelected.endAt.toDate().toISOString()}
              onIonChange={handleInputChange}
              presentation="date"
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default PromotionsModalUpdate;

const emptyValue: typePromotion = {
  uid: "",
  target: "",
  title: "",
  subtitle: "",
  imageUrl: "",
  category: "",
  description: "",
  isVisible: false,
  isPinned: false,
  startAt: Timestamp.now(),
  endAt: Timestamp.now(),
  createdAt: Timestamp.now(),
};
