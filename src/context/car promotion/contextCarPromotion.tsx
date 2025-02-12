import React, { useCallback, useState } from "react";
import { useAuthContext } from "../contextAuth";
import { CarPromotion } from "../../types/typeCarPromotion";
import { useDataContext } from "../contextData";
import CarPromotionModalCreateModify from "../../components/CarPromotion__Modal__Create&Modify/CarPromotionModalCreateModify";
import { typeFirebaseDataStructure } from "../../types/typeFirebaseDataStructure";
import { useIonAlert } from "@ionic/react";
import { typeContextStatus } from "../../types/typeContextStatus";
import { useContextLanguage } from "../contextLanguage";
import { getStatusFetch } from "../../utils/getStatusFetch";

type dataContext = {
  carPromotions: CarPromotion[];
  statusFetch: typeContextStatus | null;
  statusUpload: typeContextStatus | null;
  statusUpdate: typeContextStatus | null;
  statusDelete: typeContextStatus | null;
  addData: (data: CarPromotion) => Promise<void>;
  handleUpdate: (id: string) => void;
  updateInfo: (id: string, updatedData: Partial<CarPromotion>) => Promise<void>;
  updateIsArchived: (id: string, isArchived: boolean) => Promise<void>;
  updateIsPinned: (id: string, isPinned: boolean) => Promise<void>;
  deleteData: (id: string) => Promise<void>;
  handleOpenModal: () => void;
  initData: () => void;
};

export const CarPromotionContext = React.createContext<dataContext>({
  carPromotions: [],
  statusFetch: { status: "loading", message: "" },
  statusUpload: { status: "success", message: "" },
  statusUpdate: { status: "success", message: "" },
  statusDelete: { status: "success", message: "" },
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
  const { getCollectionData, addDocument, updateDocument, deleteDocument } =
    useDataContext();
  const [presentAlert] = useIonAlert();
  // USE STATE -----------------------------
  const [carPromotions, setCarPromotions] = useState<CarPromotion[]>([]);
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
      setStatusFetch(
        getStatusFetch("error", "fetch", l, "Utente non autenticato.")
      );
    }
  }, [authenticateUser]);

  /**
   *
   */
  const addData = useCallback(async (data: CarPromotion) => {
    setStatusUpload(getStatusFetch("loading", "upload", l));
    try {
      const doc: (CarPromotion & typeFirebaseDataStructure) | undefined =
        await addDocument<CarPromotion>(DOC_PATH, data);
      if (doc !== undefined) {
        setCarPromotions((prevPromotions) => [...prevPromotions, doc]);
      } else {
        setStatusUpload(getStatusFetch("error", "upload", l));
      }
    } catch (error) {
      console.error("Error fetching car promotions:", error);
      setStatusUpload(getStatusFetch("error", "upload", l));
    } finally {
      setStatusUpload(getStatusFetch("success", "upload", l));
    }
  }, []);

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
    async (id: string, updatedData: Partial<CarPromotion>) => {
      setStatusUpdate(getStatusFetch("loading", "update", l));
      try {
        await updateDocument<CarPromotion>(DOC_PATH, id, updatedData);

        // Update the local state directly
        setCarPromotions((prevPromotions) =>
          prevPromotions.map((promotion) =>
            promotion.uid === id ? { ...promotion, ...updatedData } : promotion
          )
        );
      } catch (error) {
        console.error("Error fetching car promotions:", error);
        setStatusUpdate(getStatusFetch("error", "update", l));
      } finally {
        setStatusUpdate(getStatusFetch("success", "update", l));
      }
    },
    []
  );

  /**
   *
   */
  const updateIsArchived = useCallback(
    async (id: string, isArchived: boolean) => {
      setStatusUpdate(getStatusFetch("loading", "update", l));
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
        setStatusUpdate(getStatusFetch("error", "update", l));
      } finally {
        setStatusUpdate(getStatusFetch("success", "update", l));
      }
    },
    []
  );

  /**
   *
   */
  const updateIsPinned = useCallback(async (id: string, isPinned: boolean) => {
    setStatusUpdate(getStatusFetch("loading", "update", l));
    try {
      await updateDocument<CarPromotion>(DOC_PATH, id, { isPinned });
      setCarPromotions((prevPromotions) =>
        prevPromotions.map((promotion) =>
          promotion.uid === id ? { ...promotion, isPinned } : promotion
        )
      );
    } catch (error) {
      console.error("Error fetching car promotions:", error);

      setStatusUpdate(getStatusFetch("error", "update", l));
    } finally {
      setStatusUpdate(getStatusFetch("success", "update", l));
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
            setStatusDelete(getStatusFetch("loading", "delete", l));
            try {
              await deleteDocument(DOC_PATH, id);
              setCarPromotions((prevPromotions) =>
                prevPromotions.filter((promotion) => promotion.uid !== id)
              );
            } catch (error) {
              console.error("Error fetching car promotions:", error);
              setStatusDelete(getStatusFetch("error", "delete", l));
            } finally {
              setStatusDelete(getStatusFetch("success", "delete", l));
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
        statusDelete,
        statusUpdate,
        statusUpload,
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
