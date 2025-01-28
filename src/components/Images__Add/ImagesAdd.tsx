import styles from "./ImagesAdd.module.css";
import { useContextLanguage } from "../../context/contextLanguage";
import { text } from "./text";
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonThumbnail,
} from "@ionic/react";
import { useState } from "react";

interface ContainerProps {
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  imageDetails: { [key: number]: { alt: string; description: string } };
  setImageDetails: React.Dispatch<
    React.SetStateAction<{
      [key: number]: { alt: string; description: string };
    }>
  >;
}

const ImagesAdd: React.FC<ContainerProps> = ({
  selectedFiles,
  setSelectedFiles,
  imageDetails,
  setImageDetails,
}) => {
  //VARIABLES ------------------------
  const { l } = useContextLanguage();
  //USE STATES -----------------------
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  //USE EFFECTS ----------------------
  //FUNCTIONS ------------------------
  const handleSelectImages = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";

    input.onchange = async (e: any) => {
      if (e.target?.files) {
        const files = Array.from(e.target.files) as File[];
        setSelectedFiles(files);
      }
    };

    input.click();
  };

  const handleAccordionClick = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index); // Toggle accordion
  };

  //RETURN COMPONENT -----------------
  return (
    <div className={styles.container}>
      <IonButton expand="block" onClick={handleSelectImages}>
        {text[l].selectImagesButton}
      </IonButton>
      <IonLabel>
        <p className="ion-padding-vertical">
          {`${text[l].text1}: ${selectedFiles.length}`}
        </p>
      </IonLabel>
      <IonAccordionGroup>
        {selectedFiles.map((image: File, index: number) => {
          const imageUrl = URL.createObjectURL(image);
          const imageSize = (image.size / 1024).toFixed(2);
          return (
            <IonAccordion
              key={index}
              value={`${index}`}
              onClick={() => handleAccordionClick(index)}
            >
              <IonItem
                slot="header"
                color={expandedIndex === index ? "light" : "medium"}
              >
                <IonThumbnail slot="start" className={styles.thumbnail}>
                  <img src={imageUrl} alt={image.name} />
                </IonThumbnail>
                <IonLabel>
                  <h3>{image.name}</h3>
                  <p>
                    {image.type}, {imageSize} KB
                  </p>
                </IonLabel>
              </IonItem>
              <div slot="content" className={styles.accordionContent}>
                <IonItem>
                  <IonLabel position="stacked">{"ALT"}</IonLabel>
                  <IonInput
                    value={imageDetails[index]?.alt || image.name.split(".")[0]}
                    onIonChange={(e) =>
                      setImageDetails({
                        ...imageDetails,
                        [index]: {
                          ...imageDetails[index],
                          alt: e.detail.value!,
                        },
                      })
                    }
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">{"DESC"}</IonLabel>
                  <IonInput
                    value={imageDetails[index]?.description || ""}
                    onIonChange={(e) =>
                      setImageDetails({
                        ...imageDetails,
                        [index]: {
                          ...imageDetails[index],
                          description: e.detail.value!,
                        },
                      })
                    }
                  />
                </IonItem>
              </div>
            </IonAccordion>
          );
        })}
      </IonAccordionGroup>
    </div>
  );
};

export default ImagesAdd;
