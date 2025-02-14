import { useContext, useEffect, useState } from "react";
import styles from "./ImageModalModify.module.css";
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
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { typeImage } from "../../types/typeImage";

interface ContainerProps {
  showModalEdit: boolean;
  setShowModalEdit: React.Dispatch<React.SetStateAction<boolean>>;
  editedImage: typeImage | null;
  handleSaveEdit: (editedImage: typeImage) => Promise<boolean>;
}

const ImageModalModify: React.FC<ContainerProps> = ({
  showModalEdit,
  setShowModalEdit,
  editedImage,
  handleSaveEdit,
}) => {
  //VARIABLES ------------------------
  const { l } = useContext(ContextLanguage);
  //CONDITIONS -----------------------
  const [editedAlt, setEditedAlt] = useState<string>(editedImage?.alt ?? "");
  const [editedDescription, setEditedDescription] = useState<string>(
    editedImage?.description ?? ""
  );
  //FUNCTIONS ------------------------
  useEffect(() => {
    if (editedImage) {
      setEditedAlt(editedImage.alt);
      setEditedDescription(editedImage.description ?? "");
    }
  }, [editedImage]);

  const save = async () => {
    editedImage!.alt = editedAlt;
    editedImage!.description = editedDescription;

    await handleSaveEdit(editedImage!)
      .then((val) => {
        setShowModalEdit(val);
      })
      .catch((e) => {
        setShowModalEdit(false);
      })
      .finally(() => {
        setShowModalEdit(false);
      });
  };
  //RETURN COMPONENT -----------------
  return (
    <IonModal
      isOpen={showModalEdit}
      onDidDismiss={() => setShowModalEdit(false)}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="medium" onClick={() => setShowModalEdit(false)}>
              {text[l].btn__close}
            </IonButton>
          </IonButtons>
          <IonTitle>{text[l].title}</IonTitle>
          <IonButtons slot="end">
            <IonButton color="success" onClick={() => save()}>
              {text[l].btn__save}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList inset>
          <IonItem>
            <IonInput
              value={editedAlt}
              label="Alt Text"
              onIonChange={(e) => setEditedAlt(e.detail.value!)}
            />
          </IonItem>
        </IonList>
        <IonLabel>
          <p>
            Il testo ALT (o alternativo) serve per aumentare le prestazioni del
            sito Web, permettendo di capire il contenuto dell'Immagine tramite
            il testo.
          </p>
        </IonLabel>

        <IonList inset>
          <IonItem>
            <IonLabel position="floating"></IonLabel>
            <IonTextarea
              label="Description"
              value={editedDescription}
              onIonChange={(e) => setEditedDescription(e.detail.value!)}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default ImageModalModify;
