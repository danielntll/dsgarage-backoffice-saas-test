import React, { useCallback, useState } from "react";
import { useAuthContext } from "../contextAuth";
import { CarPromotion } from "../../types/typeCarPromotion";
import { useDataContext } from "../contextData";
import CarPromotionModalCreateModify from "../../components/CarPromotion__Modal__Create&Modify/CarPromotionModalCreateModify";
import { typeFirebaseDataStructure } from "../../types/typeFirebaseDataStructure";
import { useIonAlert } from "@ionic/react";
import { typeContextStatus } from "../../types/typeContextStatus";
import { text } from "ionicons/icons";
import { textDataManaging } from "../../text/textDataManaging";
import { useContextLanguage } from "../contextLanguage";
import { getStatusFetch } from "../../utils/getStatusFetch";

type dataContext = {
  carPromotions: CarPromotion[];
  statusFetch: typeContextStatus;
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
      setStatusFetch(true);
      try {
        const data: CarPromotion[] | null =
          await getCollectionData<CarPromotion>(DOC_PATH);
        if (data !== null) {
          setCarPromotions(data);
        }
      } catch (error) {
        console.error("Error fetching car promotions:", error);
        setHasError({
          message: {
            en_GB: "Impossibile scaricare i dati",
            it_IT: "Impossibile scaricare i dati",
          },
        });
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      setHasError({
        message: {
          en_GB: "Errore di autenticazione",
          it_IT: "Errore di autenticazione",
        },
      });
    }
  }, [authenticateUser]);

  /**
   *
   */
  const addData = useCallback(async (data: CarPromotion) => {
    setIsLoading(true);
    try {
      const doc: (CarPromotion & typeFirebaseDataStructure) | undefined =
        await addDocument<CarPromotion>(DOC_PATH, data);
      if (doc !== undefined) {
        setCarPromotions((prevPromotions) => [...prevPromotions, doc]);
      } else {
        setHasError({
          message: {
            en_GB: "Impossibile aggiungere i dati",
            it_IT: "Impossibile aggiungere i dati",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching car promotions:", error);
      setHasError({
        message: {
          en_GB: "",
          it_IT: "",
        },
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
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
      setIsLoading(true);
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
        setHasError({
          message: {
            en_GB: "",
            it_IT: "",
          },
        });
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   *
   */
  const updateIsArchived = useCallback(
    async (id: string, isArchived: boolean) => {
      setIsLoading(true);
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
        setHasError({
          message: {
            en_GB: "",
            it_IT: "",
          },
        });
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   *
   */
  const updateIsPinned = useCallback(async (id: string, isPinned: boolean) => {
    setIsLoading(true);
    try {
      await updateDocument<CarPromotion>(DOC_PATH, id, { isPinned });
      setCarPromotions((prevPromotions) =>
        prevPromotions.map((promotion) =>
          promotion.uid === id ? { ...promotion, isPinned } : promotion
        )
      );
    } catch (error) {
      console.error("Error fetching car promotions:", error);
      setHasError({
        message: {
          en_GB: "",
          it_IT: "",
        },
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
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
            setIsLoading(true);
            try {
              await deleteDocument(DOC_PATH, id);
              setCarPromotions((prevPromotions) =>
                prevPromotions.filter((promotion) => promotion.uid !== id)
              );
            } catch (error) {
              console.error("Error fetching car promotions:", error);
              setHasError({
                message: {
                  en_GB: "",
                  it_IT: "",
                },
              });
              setIsLoading(false);
            } finally {
              setIsLoading(false);
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
