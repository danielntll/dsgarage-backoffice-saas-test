import { useContext, useState } from "react";
import styles from "./PromotionButtonNew.module.css";
import { ContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import { typePromotion } from "../../types/typeTarghet";
import { Timestamp } from "firebase/firestore";
import { usePromotionsContext } from "../../context/promotions/contextPromotions";
import {
  IonButton,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

interface ContainerProps {}

const PromotionButtonNew: React.FC<ContainerProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { handleCreatePromotion } = usePromotionsContext();
  //CONDITIONS -----------------------
  const [showModal, setShowModal] = useState(false);
  const [newPromotion, setNewPromotion] = useState<typePromotion>({
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
  });
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
            <IonTitle>{text[l].new__promotion}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem>
            <IonInput
              label="Title"
              name="title"
              value={newPromotion.title}
              onIonChange={handleInputChange}
            />
          </IonItem>

          <IonItem>
            <IonTextarea
              label="Description"
              name="description"
              value={newPromotion.description}
              onIonChange={handleInputChange}
              rows={4}
            />
          </IonItem>

          <IonItem>
            <IonSelect
              label="Category"
              name="category"
              value={newPromotion.category}
              onIonChange={handleInputChange}
              interface="popover"
            >
              <IonSelectOption value="category1">Category 1</IonSelectOption>
              <IonSelectOption value="category2">Category 2</IonSelectOption>
              <IonSelectOption value="category3">Category 3</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonInput
              label="Image URL"
              name="imageUrl"
              value={newPromotion.imageUrl}
              onIonChange={handleInputChange}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Start Date</IonLabel>
            <IonDatetime
              name="startAt"
              value={newPromotion.startAt.toDate().toISOString()}
              onIonChange={handleInputChange}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">End Date</IonLabel>
            <IonDatetime
              name="endAt"
              value={newPromotion.endAt.toDate().toISOString()}
              onIonChange={handleInputChange}
            />
          </IonItem>

          <IonButton onClick={() => handleCreatePromotion(newPromotion)}>
            {text[l].btn__create}
          </IonButton>
        </IonContent>
      </IonModal>
    </>
  );
};

export default PromotionButtonNew;
