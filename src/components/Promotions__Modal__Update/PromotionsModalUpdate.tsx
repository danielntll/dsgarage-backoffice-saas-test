import { useContext, useState } from "react";
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

interface ContainerProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  type: "create" | "update";
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
  const { handleCreatePromotion, handleAddTarget, targets } =
    usePromotionsContext();
  const { services } = useServicesContext();
  const { toast } = useContext(ContextToast);
  //CONDITIONS -----------------------
  const [isValid, setIsValid] = useState<boolean>(false);
  const [promotionSelected, setPromotionSelected] = useState<typePromotion>(
    promotionToUpdate ?? emptyValue
  );

  const [targetSelected, setTargetSelected] = useState<string>("");
  const [showNewTargetInput, setShowNewTargetInput] = useState<boolean>(false);
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

    setIsValid(
      promotionSelected.title !== "" &&
        promotionSelected.description !== "" &&
        promotionSelected.category !== "" &&
        promotionSelected.target !== "" &&
        !!promotionSelected.startAt &&
        !!promotionSelected.endAt
    );
  };

  const handleSubmit = () => {
    handleCreatePromotion(promotionSelected);
    setShowModal(false);
    setPromotionSelected(emptyValue);
  };

  const addTarget = async () => {
    if (targetSelected.trim() !== "") {
      try {
        await handleAddTarget(targetSelected);

        setPromotionSelected((prev) => ({
          ...prev,
          target: targetSelected,
        }));

        setShowNewTargetInput(false);
      } catch (error) {
        console.error("Error adding target:", error);
        toast("danger", text[l].error_create_target);
      }
    } else {
      toast("danger", text[l].error_target_empty);
    }
  };

  //RETURN COMPONENT -----------------
  return (
    <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => setShowModal(false)}>
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
              disabled={!isValid}
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
        <IonList inset>
          <IonItem>
            <IonInput
              label={text[l].title__label}
              name="title"
              labelPlacement="stacked"
              placeholder={text[l].title__placeholder}
              value={promotionSelected.title}
              onIonChange={handleInputChange}
            />
          </IonItem>

          <IonItem>
            <IonTextarea
              label={text[l].description__label}
              name="description"
              labelPlacement="stacked"
              placeholder={text[l].description__placeholdert}
              value={promotionSelected.description}
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
              value={promotionSelected.category}
              onIonChange={handleInputChange}
              interface="alert"
              cancelText={text[l].btn__cancel}
            >
              {services.map((service: typeService, index: number) => (
                <IonSelectOption key={service.uid + index} value={service.uid}>
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
              value={promotionSelected.target}
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
                value={targetSelected}
                labelPlacement="stacked"
                placeholder={text[l].target__placeholder}
                onIonChange={(e) => setTargetSelected(e.detail.value!)}
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
          value={promotionSelected.imageUrl}
          onIonChange={handleInputChange}
        />
      </IonItem> */}

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
