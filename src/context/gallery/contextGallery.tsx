import React, { useCallback, useContext, useState } from "react";
import { ContextLanguage } from "../contextLanguage";
import { AuthContext } from "../contextAuth";
import { ContextToast } from "../systemEvents/contextToast";
import { typeImage } from "../../types/typeImage";
import { useIonAlert, useIonLoading } from "@ionic/react";
import { text } from "./text";
import ImageOverlay from "../../components/Image__Overlay/ImageOverlay";
import ImageModalModify from "../../components/Image__Modal__Modify/ImageModalModify";
import { useDataContext } from "../contextData";
import { typeContextStatus } from "../../types/typeContextStatus";
import { getStatusFetch } from "../../utils/getStatusFetch";
import { typeFirebaseDataStructure } from "../../types/typeFirebaseDataStructure";
import { typeImageUploadData } from "../../types/typeImageUploadData";

type galleryContext = {
  initData: () => void;
  addData: (
    imagesToUpload: File[],
    imageDetails: typeImageUploadData
  ) => Promise<void>;
  handleShowImageOverlay: (image: typeImage) => void;
  handleDeleteImage: (image: typeImage) => void;
  handleEditImage: (image: typeImage) => void;
  handleTogglePinImage: (image: typeImage) => Promise<void>;
  handleToggleArchiveImage: (image: typeImage) => Promise<void>;
  galleryData: typeImage[];
  statusFetch: typeContextStatus | null;
  statusUpload: typeContextStatus | null;
  statusUpdate: typeContextStatus | null;
  statusDelete: typeContextStatus | null;
};

export const GalleryContext = React.createContext<galleryContext>({
  initData: () => {},
  addData: async () => Promise.resolve(),
  handleShowImageOverlay: () => {},
  handleDeleteImage: () => {},
  handleEditImage: () => {},
  handleTogglePinImage: async () => Promise.resolve(),
  handleToggleArchiveImage: async () => Promise.resolve(),
  galleryData: [],
  statusFetch: { status: "loading", message: "" },
  statusUpload: { status: "success", message: "" },
  statusUpdate: { status: "success", message: "" },
  statusDelete: { status: "success", message: "" },
});

export const useGalleryContext = () => React.useContext(GalleryContext);

export const GalleryContextProvider = ({ children }: any) => {
  // VARIABLES ------------------------------
  const DOC_PATH = "gallery";
  const perPage: number = 10;
  const { l } = useContext(ContextLanguage);
  const { authenticateUser } = useContext(AuthContext);
  const {
    getCollectionData,
    addDocument,
    updateDocument,
    deleteDocument,
    uploadFile,
    deleteFile,
  } = useDataContext();
  const { toast } = useContext(ContextToast);
  const [presentAlert] = useIonAlert();
  const [presentLoading, dismissLoading] = useIonLoading();

  // USE STATE -----------------------------
  const [galleryData, setGalleryData] = useState<typeImage[]>([]);
  const [statusFetch, setStatusFetch] = useState<typeContextStatus | null>(
    getStatusFetch("loading", "fetch", l)
  );
  const [statusUpload, setStatusUpload] = useState<typeContextStatus | null>(
    getStatusFetch("success", "upload", l)
  );
  const [statusUpdate, setStatusUpdate] = useState<typeContextStatus | null>(
    getStatusFetch("success", "update", l)
  );
  const [statusDelete, setStatusDelete] = useState<typeContextStatus | null>(
    getStatusFetch("success", "delete", l)
  );

  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayImage, setOverlayImage] = useState<typeImage | null>(null);

  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editedImage, setEditedImage] = useState<typeImage | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(2);
  // USE EFFECT ------------------------------
  // FUNCTIONS -----------------------------
  // ---  initData
  /**
   *
   */
  const initData = useCallback(async () => {
    if (authenticateUser !== null) {
      setStatusFetch(getStatusFetch("loading", "fetch", l));
      try {
        const data: typeImage[] | null = await getCollectionData<typeImage>(
          DOC_PATH
        );
        if (data !== null) {
          setGalleryData(data);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setStatusFetch(getStatusFetch("error", "fetch", l));
      } finally {
        setStatusFetch(getStatusFetch("success", "fetch", l));
      }
    } else {
      setStatusFetch(
        getStatusFetch("error", "fetch", l, "Utente non autenticato.")
      );
    }
  }, [authenticateUser, l]);

  /**
   *
   */
  const addData = useCallback(
    async (imagesToUpload: File[], imageDetails: typeImageUploadData) => {
      setStatusUpload(getStatusFetch("loading", "upload", l));

      try {
        const uploadPromises = imagesToUpload.map(async (file, index) => {
          const filePath = `/gallery/${file.name}`; // Define the storage path
          const downloadURL = await uploadFile(filePath, file);

          if (downloadURL) {
            const newImage: typeImage = {
              imageUrl: downloadURL,
              alt: imageDetails[index]?.alt || file.name.split(".")[0],
              description: imageDetails[index]?.description || "",
              name: file.name,
            };
            return newImage;
          } else {
            // Handle upload error, maybe reject the promise or throw an error
            console.error("Error uploading image:", file.name);
            toast("danger", `Error uploading ${file.name}`);
            return null;
          }
        });

        const uploadedImages = (await Promise.all(uploadPromises)).filter(
          (image) => image !== null
        ) as typeImage[]; // Filter out any null results from upload errors

        if (uploadedImages.length > 0) {
          const addFirestorePromises = uploadedImages.map(async (image) => {
            try {
              const doc: (typeImage & typeFirebaseDataStructure) | undefined =
                await addDocument<typeImage>(DOC_PATH, image);
              if (doc !== undefined) {
                return doc; // Return the successfully added document
              } else {
                // Handle firestore add error
                console.error("Error adding image to Firestore:", image.name);
                toast("danger", `Error adding ${image.name} to Firestore`);
                return null; // Or throw an error to stop the process if desired
              }
            } catch (error) {
              console.error("Error in addDocument:", error);
              return null; // Or throw the error
            }
          });

          const firestoreResults = await Promise.all(addFirestorePromises);
          const successfullyAddedImages = firestoreResults.filter(
            (result) => result !== null
          ) as (typeImage & typeFirebaseDataStructure)[]; //Filter null results

          setGalleryData((prev) => [...prev, ...successfullyAddedImages]);
          setStatusUpload(getStatusFetch("success", "upload", l));
          toast("success", "Images uploaded successfully");
        } else {
          // Handle the case where no images were uploaded successfully.
          setStatusUpload(getStatusFetch("error", "upload", l));
          toast("danger", "No images uploaded successfully.");
        }
      } catch (error) {
        console.error("Error uploading images:", error);
        setStatusUpload(getStatusFetch("error", "upload", l));
        toast("danger", "Error uploading images");
      }
    },
    [l]
  );

  /**
   * Alert di avviso per l'eliminazione del file.
   *
   * @param image
   */
  const handleDeleteImage = async (image: typeImage) => {
    presentAlert({
      header: text[l].alertDeleteTitle,
      message: text[l].alertDeleteMessage,
      buttons: [
        { text: text[l].alertDeleteCancel, role: "cancel" },
        {
          text: text[l].alertDeleteConfirm,
          role: "confirm",
          handler: async () => {
            await _deleteImage(image);
          },
        },
      ],
    });
  };

  /**
   * Esecuzione di eliminazione file e documento.
   *
   * @param image
   */
  const _deleteImage = async (image: typeImage) => {
    presentLoading({ message: text[l].loading });
    try {
      // Delete from Storage first to avoid potential issues if Firestore deletion fails
      await deleteFile(`gallery/${image.name}`);

      // Delete from Firestore
      await deleteDocument(DOC_PATH, image.uid!);

      // Update local state
      setGalleryData((prevData) =>
        prevData.filter((item) => item.uid !== image.uid)
      );
      toast("success", "Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast("danger", "Error deleting image. Please try again later.");
    } finally {
      dismissLoading();
    }
  };

  /**
   * Apre il modale di modifica immagine
   * @param image
   */
  const handleEditImage = (image: typeImage) => {
    setEditedImage(image);
    setShowModalEdit(true);
  };

  /**
   *
   */
  const handleSaveEdit = useCallback(
    async (updatedImage: typeImage): Promise<boolean> => {
      try {
        setStatusUpdate(getStatusFetch("loading", "update", l));
        await updateDocument(DOC_PATH, updatedImage.uid!, updatedImage);
        setGalleryData((prevData) =>
          prevData.map((item) =>
            item.uid === updatedImage.uid ? updatedImage : item
          )
        );
        setStatusUpdate(getStatusFetch("success", "update", l));
        toast("success", "Immagine aggiornata correttamente");
        setShowModalEdit(false);
        return true;
      } catch (error) {
        console.error("Error updating image:", error);
        setStatusUpdate(getStatusFetch("error", "update", l));
        toast("danger", "Errore durante l'aggiornamento dell'immagine");
        return false;
      }
    },
    [l]
  );

  /**
   * Chiude l'immagine in full screen
   * e resetta la variabile
   */
  const hanldeCloseOverlay = () => {
    setShowOverlay(false);
    setOverlayImage(null);
  };

  /**
   * Apre l'immagine selezionata in full screen
   *
   * @param image typeImage: l'immagine da aprire
   */
  const handleShowImageOverlay = (image: typeImage) => {
    setOverlayImage(image);
    setShowOverlay(true);
  };

  /**
   * Gestisce il toggle del pin di un'immagine.
   * @param image L'immagine da aggiornare.
   */
  const handleTogglePinImage = useCallback(async (image: typeImage) => {
    try {
      const updatedImage = { ...image, isPinned: !image.isPinned };
      await updateDocument(DOC_PATH, image.uid!, updatedImage);
      setGalleryData((prevData) =>
        prevData.map((item) => (item.uid === image.uid ? updatedImage : item))
      );
      toast(
        "success",
        `Immagine ${
          updatedImage.isPinned ? "aggiunta" : "rimossa"
        } dai preferiti`
      );
    } catch (error) {
      console.error("Error toggling pin:", error);
      toast("danger", "Errore durante l'aggiornamento dei preferiti");
    }
  }, []);

  /**
   * Gestisce il toggle dell'archiviazione di un'immagine.
   * @param image L'immagine da aggiornare.
   */
  const handleToggleArchiveImage = useCallback(async (image: typeImage) => {
    try {
      const updatedImage = { ...image, isArchived: !image.isArchived };
      await updateDocument(DOC_PATH, image.uid!, updatedImage);
      setGalleryData((prevData) =>
        prevData.map((item) => (item.uid === image.uid ? updatedImage : item))
      );
      toast(
        "success",
        `Immagine ${
          updatedImage.isArchived ? "aggiunta" : "rimossa"
        } dall'archivio`
      );
    } catch (error) {
      console.error("Error toggling archive:", error);
      toast("danger", "Errore durante l'aggiornamento dell'archivio");
    }
  }, []);

  // RETURN ---------------------------------
  return (
    <GalleryContext.Provider
      value={{
        galleryData,
        statusFetch,
        statusUpload,
        statusUpdate,
        statusDelete,
        addData,
        initData,
        handleShowImageOverlay,
        handleDeleteImage,
        handleEditImage,
        handleTogglePinImage,
        handleToggleArchiveImage,
      }}
    >
      {children}
      {showOverlay && (
        <ImageOverlay
          showOverlay={showOverlay}
          overlayImage={overlayImage}
          callbackCloseOverlay={hanldeCloseOverlay}
        />
      )}
      <>
        <ImageModalModify
          showModalEdit={showModalEdit}
          setShowModalEdit={setShowModalEdit}
          editedImage={editedImage}
          handleSaveEdit={handleSaveEdit}
        />
      </>
    </GalleryContext.Provider>
  );
};
