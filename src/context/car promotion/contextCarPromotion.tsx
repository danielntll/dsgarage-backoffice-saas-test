import React, { useCallback, useEffect, useState } from "react";
import { useContextLanguage } from "../contextLanguage";
import { useAuthContext } from "../contextAuth";
import { useContextToast } from "../systemEvents/contextToast";
import { CarPromotion } from "../../types/typeCarPromotion";
import { useDataContext } from "../contextData";
import { serverTimestamp } from "firebase/firestore";
import { typeHasError } from "../../types/typeHasError";
import CarPromotionModalCreateModify from "../../components/CarPromotion__Modal__Create&Modify/CarPromotionModalCreateModify";

type dataContext = {
  carPromotions: CarPromotion[];
  isLoading: boolean;
  hasError: typeHasError | null;
  addData: (data: CarPromotion) => Promise<void>;
  updateInfo: (id: string, updatedData: Partial<CarPromotion>) => Promise<void>;
  updateIsArchived: (id: string, isArchived: boolean) => Promise<void>;
  updateIsPinned: (id: string, isPinned: boolean) => Promise<void>;
  deleteData: (id: string) => Promise<void>;
  handleOpenModal: () => void;
};

export const CarPromotionContext = React.createContext<dataContext>({
  carPromotions: [],
  isLoading: false,
  hasError: null,
  addData: async () => Promise.resolve(),
  updateInfo: async () => Promise.resolve(),
  updateIsArchived: async () => Promise.resolve(),
  updateIsPinned: async () => Promise.resolve(),
  deleteData: async () => Promise.resolve(),
  handleOpenModal: () => {},
});

export const useCarPromotionContext = () =>
  React.useContext(CarPromotionContext);

export const CarPromotionContextProvider = ({ children }: any) => {
  // VARIABLES ------------------------------
  const DOC_PATH = "carpromotions";
  const { l } = useContextLanguage();
  const { authenticateUser } = useAuthContext();
  const { toast } = useContextToast();
  const { getCollectionData, addDocument, updateDocument, deleteDocument } =
    useDataContext();
  // USE STATE -----------------------------
  const [carPromotions, setCarPromotions] = useState<CarPromotion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<typeHasError | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // USE EFFECT ------------------------------
  useEffect(() => {
    if (authenticateUser !== undefined) {
      initData();
    }
  }, [authenticateUser]);
  // FUNCTIONS ------------------------------

  // ---  initData
  /**
   *
   */
  const initData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data: CarPromotion[] | null = await getCollectionData<CarPromotion>(
        DOC_PATH
      );
      if (data !== null) {
        setCarPromotions(data);
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

  const addData = useCallback(async (data: CarPromotion) => {
    setIsLoading(true);
    try {
      const docRef = await addDocument<CarPromotion>(DOC_PATH, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        byUserUID: authenticateUser!.uid,
      });
      setCarPromotions((prevPromotions) => [
        ...prevPromotions,
        { ...data, uid: docRef!.id },
      ]);
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

  const deleteData = useCallback(async (id: string) => {
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
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // RETURN ---------------------------------
  return (
    <CarPromotionContext.Provider
      value={{
        isLoading,
        hasError,
        carPromotions,
        addData,
        updateInfo,
        updateIsArchived,
        updateIsPinned,
        deleteData,
        handleOpenModal,
      }}
    >
      {children}
      {/* ----- EXTRA CONTENT ----- */}
      <CarPromotionModalCreateModify
        isModalOpen={isModalOpen}
        callbackCloseModal={() => setIsModalOpen(false)}
      />
    </CarPromotionContext.Provider>
  );
};
