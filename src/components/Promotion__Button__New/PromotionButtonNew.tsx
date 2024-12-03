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

interface ContainerProps {}

const PromotionButtonNew: React.FC<ContainerProps> = ({}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  const { handleCreatePromotion } = usePromotionsContext();
  //CONDITIONS -----------------------
  const [showModal, setShowModal] = useState(false);
  const [isValid, setIsValid] = useState(false);
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
                  handleCreatePromotion(newPromotion);
                  setShowModal(false); // Close modal after creation
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
                label={text[l].title__placeholder}
                name="title"
                value={newPromotion.title}
                onIonChange={handleInputChange}
              />
            </IonItem>

            <IonItem>
              <IonTextarea
                label={text[l].description__placeholder}
                name="description"
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
                label={text[l].category__placeholder}
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
          </IonList>

          <IonLabel>
            <p className="ion-padding-horizontal">{text[l].info__category}</p>
          </IonLabel>

          <IonList inset>
            <IonItem>
              <IonSelect
                label={text[l].target__placeholder}
                name="target"
                value={newPromotion.target}
                onIonChange={handleInputChange}
                interface="popover"
              >
                <IonSelectOption value="target1">target1</IonSelectOption>
                <IonSelectOption value="target2">target1 2</IonSelectOption>
                <IonSelectOption value="target3">target1 3</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>
          <IonLabel>
            <p className="ion-padding-horizontal">{text[l].info__target}</p>
          </IonLabel>

          {/* <IonItem>
            <IonInput
              label={text[l].imageurl__placeholder}
              name="imageUrl"
              value={newPromotion.imageUrl}
              onIonChange={handleInputChange}
            />
          </IonItem> */}

          <IonList inset>
            <IonItem>
              <IonLabel position="stacked">
                {text[l].startAt__placeholder}
              </IonLabel>
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
              <IonLabel position="stacked">
                {text[l].endAt__placeholder}
              </IonLabel>
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
