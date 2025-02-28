import React, { useCallback, useState } from "react";
import { useAuthContext } from "../contextAuth";
import { CarPromotion } from "../../types/typeCarPromotion";
import { useDataContext } from "../contextData";
import CarPromotionModalCreateModify from "../../components/CarPromotion__Modal__Create&Modify/CarPromotionModalCreateModify";
import { useIonAlert } from "@ionic/react";
import { typeContextStatus } from "../../types/typeContextStatus";
import { useContextLanguage } from "../contextLanguage";
import { getStatusFetch } from "../../utils/getStatusFetch";
import { typeImageSimple } from "../../types/typeImageSimple";

type dataContext = {
  carPromotions: CarPromotion[];
  statusFetch: typeContextStatus;
  addData: (data: CarPromotion, imageFiles: File[]) => Promise<void>;
  handleUpdate: (id: string) => void;
  updateInfo: (
    id: string,
    updatedData: Partial<CarPromotion>,
    imageFiles: File[]
  ) => Promise<void>;
  updateIsArchived: (id: string, isArchived: boolean) => Promise<void>;
  updateIsPinned: (id: string, isPinned: boolean) => Promise<void>;
  deleteData: (id: string) => Promise<void>;
  handleOpenModal: () => void;
  initData: () => void;
};

export const CarPromotionContext = React.createContext<dataContext>({
  carPromotions: [],
  statusFetch: { status: "loading", message: "" },
  addData: async () => Promise.resolve(),
  handleUpdate: async () => {},
  updateInfo: async () => Promise.resolve(),
  updateIsArchived: async () => Promise.resolve(),
  updateIsPinned: async () => Promise.resolve(),
  deleteData: async () => Promise.resolve(),
  handleOpenModal: () => {},
  initData: () => {},
});

export const useCarPromotionContext = () =>
  React.useContext(CarPromotionContext);

export const CarPromotionContextProvider = ({ children }: any) => {
  // VARIABLES ------------------------------
  const DOC_PATH = "carpromotions";
  const { l } = useContextLanguage();
  const { authenticateUser } = useAuthContext();
  const {
    getCollectionData,
    addDocument,
    updateDocument,
    deleteDocument,
    uploadFile,
  } = useDataContext();
  const [presentAlert] = useIonAlert();
  // USE STATE -----------------------------
  const [carPromotions, setCarPromotions] = useState<CarPromotion[]>([]);
  const [statusFetch, setStatusFetch] = useState<typeContextStatus>(
    getStatusFetch("loading", "fetch", l)
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [elementToModify, setElementToModify] = useState<CarPromotion | null>(
    null
  );
  // USE EFFECT ------------------------------
  // FUNCTIONS ------------------------------
  // ---  initData
  /**
   *
   */
  const initData = useCallback(async () => {
    if (authenticateUser !== null) {
      setStatusFetch(getStatusFetch("loading", "fetch", l));
      try {
        const data: CarPromotion[] | null =
          await getCollectionData<CarPromotion>(DOC_PATH);
        if (data !== null) {
          setCarPromotions(data);
        }
      } catch (error) {
        console.error("Error fetching car promotions:", error);
        setStatusFetch(getStatusFetch("error", "fetch", l));
      } finally {
        setStatusFetch(getStatusFetch("success", "fetch", l));
      }
    } else {
      setStatusFetch(getStatusFetch("error", "fetch", l));
    }
  }, [authenticateUser]);

  /**
   *
   */
  const addData = useCallback(
    async (data: CarPromotion, imageFiles: File[]) => {
      setStatusFetch(getStatusFetch("loading", "upload", l));
      try {
        const imageUrls: typeImageSimple[] = [];
        // Upload images concurrently
        await Promise.all(
          imageFiles.map(async (file, index) => {
            const fileUID = file.name + index + new Date().getTime();
            const imageUrl =
              (await uploadFile(`${DOC_PATH}/${fileUID}`, file)) || "";
            if (imageUrl) {
              imageUrls.push({
                url: imageUrl,
                uid: fileUID,
              });
            } else {
              throw new Error("Image upload failed");
            }
          })
        );

        const carPromotionDataWithImages: CarPromotion = {
          ...data,
          images: imageUrls,
        };
        const doc: any = await addDocument<CarPromotion>(
          DOC_PATH,
          carPromotionDataWithImages
        );
        if (doc !== undefined) {
          setCarPromotions((prevPromotions) => [...prevPromotions, doc]);
        } else {
          setStatusFetch(getStatusFetch("error", "upload", l));
          throw new Error("Failed to add document");
        }
      } catch (error) {
        console.error("Error adding car promotion:", error);
        setStatusFetch(getStatusFetch("error", "upload", l));
      } finally {
        setStatusFetch(getStatusFetch("success", "upload", l));
      }
    },
    []
  );

  /**
   *
   * @param id
   */
  const handleUpdate = (id: string) => {
    setElementToModify(
      carPromotions.find((promotion) => promotion.uid === id) ?? null
    );
    handleOpenModal();
  };

  /**
   *
   */
  const updateInfo = useCallback(
    async (
      id: string,
      updatedData: Partial<CarPromotion>,
      imageFiles: File[]
    ) => {
      setStatusFetch(getStatusFetch("loading", "update", l));
      try {
        let imageUrls: typeImageSimple[] = [];

        // Check if there are new images to upload
        if (imageFiles.length > 0) {
          // Upload images concurrently
          imageUrls = await Promise.all(
            imageFiles.map(async (file, index) => {
              const fileUID = file.name + index + new Date().getTime();
              const imageUrl =
                (await uploadFile(`${DOC_PATH}/${fileUID}`, file)) || "";
              if (imageUrl) {
                return {
                  url: imageUrl,
                  uid: fileUID,
                };
              } else {
                throw new Error("Image upload failed");
              }
            })
          ).then((imageSimple) =>
            imageSimple.filter(
              (imageSimple): imageSimple is typeImageSimple =>
                imageSimple.url !== undefined
            )
          );
        }

        //Get old images
        const oldImages: typeImageSimple[] = updatedData.images ?? [];

        //merge new images with old images
        const allImages = [...oldImages, ...imageUrls];

        // Update data with new images url
        const updatedDataWithImages: Partial<CarPromotion> = {
          ...updatedData,
          images: allImages,
        };

        await updateDocument<CarPromotion>(DOC_PATH, id, updatedDataWithImages);

        // Update the local state directly
        setCarPromotions((prevPromotions) =>
          prevPromotions.map((promotion) =>
            promotion.uid === id ? { ...promotion, ...updatedData } : promotion
          )
        );
      } catch (error) {
        console.error("Error fetching car promotions:", error);
        setStatusFetch(getStatusFetch("error", "update", l));
      } finally {
        setStatusFetch(getStatusFetch("success", "update", l));
      }
    },
    []
  );

  /**
   *
   */
  const updateIsArchived = useCallback(
    async (id: string, isArchived: boolean) => {
      try {
        await updateDocument<CarPromotion>(DOC_PATH, id, { isArchived });

        // Update local state directly
        setCarPromotions((prevPromotions) =>
          prevPromotions.map((promotion) =>
            promotion.uid === id ? { ...promotion, isArchived } : promotion
          )
        );
      } catch (error) {
        console.error("Error fetching car promotions:", error);
      }
    },
    []
  );

  /**
   *
   */
  const updateIsPinned = useCallback(async (id: string, isPinned: boolean) => {
    try {
      await updateDocument<CarPromotion>(DOC_PATH, id, { isPinned });
      setCarPromotions((prevPromotions) =>
        prevPromotions.map((promotion) =>
          promotion.uid === id ? { ...promotion, isPinned } : promotion
        )
      );
    } catch (error) {
      console.error("Error fetching car promotions:", error);
    } finally {
    }
  }, []);

  /**
   *
   */
  const deleteData = useCallback(async (id: string) => {
    presentAlert({
      header: "Attenzione",
      subHeader: "Azione irreversibile",
      message: "Sicuro di voler eliminare questo elemento in modo definitivo?",
      buttons: [
        {
          text: "Annulla",
          role: "cancel",
          handler: () => {
            console.log("Alert canceled");
          },
        },
        {
          text: "OK",
          role: "confirm",
          handler: async () => {
            setStatusFetch(getStatusFetch("loading", "delete", l));
            try {
              await deleteDocument(DOC_PATH, id);
              setCarPromotions((prevPromotions) =>
                prevPromotions.filter((promotion) => promotion.uid !== id)
              );
            } catch (error) {
              console.error("Error fetching car promotions:", error);
              setStatusFetch(getStatusFetch("error", "delete", l));
            } finally {
              setStatusFetch(getStatusFetch("success", "delete", l));
            }
          },
        },
      ],
    });
  }, []);

  /**
   *
   */
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // RETURN ---------------------------------
  return (
    <CarPromotionContext.Provider
      value={{
        statusFetch,
        carPromotions,
        addData,
        handleUpdate,
        updateInfo,
        updateIsArchived,
        updateIsPinned,
        deleteData,
        handleOpenModal,
        initData,
      }}
    >
      {children}
      {/* ----- EXTRA CONTENT ----- */}
      <CarPromotionModalCreateModify
        isModalOpen={isModalOpen}
        callbackCloseModal={() => {
          setIsModalOpen(false);
          setElementToModify(null);
        }}
        elementToModify={elementToModify}
      />
    </CarPromotionContext.Provider>
  );
};
