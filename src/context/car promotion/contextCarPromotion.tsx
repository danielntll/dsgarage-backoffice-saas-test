import React, { useCallback, useEffect, useState } from "react";
import { useContextLanguage } from "../contextLanguage";
import { useAuthContext } from "../contextAuth";
import { useContextToast } from "../systemEvents/contextToast";
import { CarPromotion } from "../../types/typeCarPromotion";
import { useDataContext } from "../contextData";
import { serverTimestamp } from "firebase/firestore";

type dataContext = {
  carPromotions: CarPromotion[];
  isLoading: boolean;
};

export const CarPromotionContext = React.createContext<dataContext>({
  carPromotions: [],
  isLoading: false,
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
  const initData = async () => {
    setIsLoading(true);
    try {
      const data: CarPromotion[] = await getCollectionData<CarPromotion>(
        DOC_PATH
      );
      setCarPromotions(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const addData = useCallback(
    async (data: CarPromotion) => {
      try {
        const docRef = await addDocument<CarPromotion>(DOC_PATH, {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          byUserUID: authenticateUser!.uid,
        });

        // Update local state directly after successful addition
        setCarPromotions((prevPromotions) => [
          ...prevPromotions,
          { ...data, uid: docRef.uid },
        ]);
      } catch (error) {
        console.error("Error adding car promotion:", error);
        toast.error(l.toast.addCarPromotionError); // Add error handling
      }
    },
    [addDocument, DOC_PATH, setCarPromotions, toast, l, authenticateUser]
  );

  const updateInfo = useCallback(
    async (id: string, updatedData: Partial<CarPromotion>) => {
      try {
        await updateDocument<CarPromotion>(DOC_PATH, id, updatedData);

        // Update the local state directly
        setCarPromotions((prevPromotions) =>
          prevPromotions.map((promotion) =>
            promotion.id === id ? { ...promotion, ...updatedData } : promotion
          )
        );
      } catch (error) {
        console.error("Error updating car promotion info:", error);
      }
    },
    [updateDocument, DOC_PATH, setCarPromotions]
  );

  const updateIsArchived = useCallback(
    async (id: string, isArchived: boolean) => {
      try {
        await updateDocument<CarPromotion>(DOC_PATH, id, { isArchived });

        // Update local state directly
        setCarPromotions((prevPromotions) =>
          prevPromotions.map((promotion) =>
            promotion.id === id ? { ...promotion, isArchived } : promotion
          )
        );
      } catch (error) {
        console.error("Error updating isArchived:", error);
      }
    },
    [updateDocument, DOC_PATH, setCarPromotions]
  );

  const updateIsPinned = useCallback(
    async (id: string, isPinned: boolean) => {
      try {
        await updateDocument<CarPromotion>(DOC_PATH, id, { isPinned });

        // Update local state directly
        setCarPromotions((prevPromotions) =>
          prevPromotions.map((promotion) =>
            promotion.id === id ? { ...promotion, isPinned } : promotion
          )
        );
      } catch (error) {
        console.error("Error updating isPinned:", error);
      }
    },
    [updateDocument, DOC_PATH, setCarPromotions]
  );

  const deleteData = useCallback(
    async (id: string) => {
      try {
        await deleteDocument(DOC_PATH, id);
        setCarPromotions((prevPromotions) =>
          prevPromotions.filter((promotion) => promotion.id !== id)
        );
      } catch (error) {
        console.error("Error deleting car promotion:", error);
      }
    },
    [deleteDocument, DOC_PATH, setCarPromotions, toast, l]
  );

  // RETURN ---------------------------------
  return (
    <CarPromotionContext.Provider
      value={{
        isLoading,
        carPromotions,
      }}
    >
      {children}
    </CarPromotionContext.Provider>
  );
};
