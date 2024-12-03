import { useContext, useState } from "react";
import styles from "./PromotionButtonNew.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { typePromotion } from "../../types/typeTarghet";
import { Timestamp } from "firebase/firestore";
import { usePromotionsContext } from "../../context/promotions/contextPromotions";
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
import { addOutline } from "ionicons/icons";
import { ContextToast } from "../../context/systemEvents/contextToast";
import { useServicesContext } from "../../context/services/contextServices";
import { typeService } from "../../types/typeService";

interface ContainerProps {}

const PromotionButtonNew: React.FC<ContainerProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { handleCreatePromotion, handleAddTarget, targets } =
    usePromotionsContext();
  const { services } = useServicesContext();
  const { toast } = useContext(ContextToast);
  //CONDITIONS -----------------------
  const [showModal, setShowModal] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [newPromotion, setNewPromotion] = useState<typePromotion>(emptyValue);

  const [newTarget, setNewTarget] = useState(""); // State for new target input
  const [showNewTargetInput, setShowNewTargetInput] = useState(false); // Toggle visibility

  //FUNCTIONS ------------------------
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "startAt" || name === "endAt") {
      // or name === "createdAt"
      setNewPromotion({
        ...newPromotion,
        [name]: Timestamp.fromDate(new Date(value)), // Convert to Timestamp
      });
    } else {
      setNewPromotion({ ...newPromotion, [name]: value });
    }
    // Validation logic: Check if all required fields are filled
    setIsValid(
      newPromotion.title !== "" &&
        newPromotion.description !== "" &&
        newPromotion.category !== "" &&
        newPromotion.target !== "" &&
        // newPromotion.imageUrl !== "" &&
        !!newPromotion.startAt &&
        !!newPromotion.endAt
    );
  };

  const handleSubmit = () => {
    handleCreatePromotion(newPromotion);
    setShowModal(false);
    setNewPromotion(emptyValue);
  };

  const addTarget = async () => {
    if (newTarget.trim() !== "") {
      try {
        await handleAddTarget(newTarget); // Await the promise

        setNewPromotion((prev) => ({
          ...prev,
          target: newTarget, // Set the new target in state
        }));

        setShowNewTargetInput(false); // Hide the input
      } catch (error) {
        // Handle errors (e.g., show a toast)
        console.error("Error adding target:", error);
      }
    } else {
      toast("danger", text[l].error_target_empty);
    }
  };
  //RETURN COMPONENT -----------------
  return (
    <>
      <IonButton onClick={() => setShowModal(true)}>
        {text[l].create_promotion}
      </IonButton>
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton color="medium" onClick={() => setShowModal(false)}>
                {text[l].btn__cancel} {/* Or appropriate text for "Cancel" */}
              </IonButton>
            </IonButtons>
            <IonTitle>{text[l].new__promotion}</IonTitle>
            <IonButtons slot="end">
              <IonButton
                disabled={!isValid} // Disable if not valid
                onClick={() => {
                  handleSubmit();
                }}
              >
                {text[l].btn__create}
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList inset>
            <IonItem>
              <IonInput
                label={text[l].title__label}
                name="title"
                labelPlacement="stacked"
                placeholder={text[l].title__placeholder}
                value={newPromotion.title}
                onIonChange={handleInputChange}
              />
            </IonItem>

            <IonItem>
              <IonTextarea
                label={text[l].description__label}
                name="description"
                labelPlacement="stacked"
                placeholder={text[l].description__placeholdert}
                value={newPromotion.description}
                onIonChange={handleInputChange}
                rows={4}
              />
            </IonItem>
          </IonList>

          <IonLabel>
            <p className="ion-padding-horizontal">{text[l].info__title}</p>
          </IonLabel>

          <IonList inset>
            <IonItem>
              <IonSelect
                label={text[l].category__label}
                name="category"
                value={newPromotion.category}
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

          <IonList inset>
            <IonItem>
              <IonSelect
                label={text[l].target__label}
                name="target"
                value={newPromotion.target}
                onIonChange={handleInputChange}
                interface="alert"
                cancelText={text[l].btn__cancel}
              >
                {targets.map((target) => (
                  <IonSelectOption key={target} value={target}>
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
                  value={newTarget}
                  labelPlacement="stacked"
                  placeholder={text[l].target__placeholder}
                  onIonChange={(e) => setNewTarget(e.detail.value!)}
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

          {/* <IonItem>
            <IonInput
              label={text[l].imageurl__label}
              name="imageUrl"
              value={newPromotion.imageUrl}
              onIonChange={handleInputChange}
            />
          </IonItem> */}

          <IonList inset>
            <IonItem>
              <IonLabel position="stacked">{text[l].startAt__label}</IonLabel>
              <IonDatetime
                name="startAt"
                value={newPromotion.startAt.toDate().toISOString()}
                onIonChange={handleInputChange}
                presentation="date"
              />
            </IonItem>
          </IonList>

          <IonList inset>
            <IonItem>
              <IonLabel position="stacked">{text[l].endAt__label}</IonLabel>
              <IonDatetime
                name="endAt"
                value={newPromotion.endAt.toDate().toISOString()}
                onIonChange={handleInputChange}
                presentation="date"
              />
            </IonItem>
          </IonList>
        </IonContent>
      </IonModal>
    </>
  );
};

export default PromotionButtonNew;

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
