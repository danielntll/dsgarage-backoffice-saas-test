import React, { useContext, useEffect, useState } from "react";
import { ContextLanguage } from "../contextLanguage";
import { AuthContext } from "../contextAuth";
import { ContextToast } from "../systemEvents/contextToast";
import { typePromotion } from "../../types/typeTarghet";
import { text } from "./text";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

type dataContext = {
  promotionsData: typePromotion[];
  loadMoreData: () => Promise<void>;
  handleCreatePromotion: (newPromotion: typePromotion) => Promise<void>;
};

export const PromotionsContext = React.createContext<dataContext>({
  promotionsData: [],
  loadMoreData: async () => {},
  handleCreatePromotion: async () => {},
});

export const usePromotionsContext = () => React.useContext(PromotionsContext);

export const PromotionsContextProvider = ({ children }: any) => {
  // VARIABLES ------------------------------
  const perPage: number = 10;
  const { l } = useContext(ContextLanguage);
  const { authenticateUser } = useContext(AuthContext);
  const { toast, loadingAlert, dismissLoadingAlert } = useContext(ContextToast);
  // USE STATE -----------------------------
  const [promotionsData, setPromotionsData] = useState<typePromotion[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState<number>(2);

  // USE EFFECT ------------------------------
  useEffect(() => {
    if (authenticateUser !== undefined) {
      fetchPromotionsData();
    }
  }, [authenticateUser]);
  // FUNCTIONS ------------------------------

  // ---  initData
  /**
   *
   */
  const fetchPromotionsData = async () => {
    loadingAlert(text[l].loading);
    try {
      setLoading(true);

      const promozioniRef = collection(db, "promotions");
      let q = query(promozioniRef, orderBy("createdAt"));

      if (currentPage > 1 && promotionsData.length > 0) {
        const lastVisible = promotionsData[promotionsData.length - 1];
        q = query(q, startAfter(lastVisible.createdAt));
      }

      q = query(q, limit(perPage));

      const snapshot = await getDocs(q);

      const newData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      })) as typePromotion[];

      const promotions =
        currentPage === 1 ? newData : [...promotionsData, ...newData];
      setPromotionsData(promotions);

      dismissLoadingAlert();
      newData.length === 0 &&
        toast("success", "Hai caricato tutte le promozioni");
    } catch (err) {
      dismissLoadingAlert();
      setError(err);
      console.error("Error fetching promozioni data:", err);
      toast("danger", "Error loading promozioni data");
    } finally {
      dismissLoadingAlert();
      setLoading(false);
    }
    dismissLoadingAlert();
  };

  const loadMoreData = async () => {};

  const handleCreatePromotion = async (newPromotion: typePromotion) => {
    try {
      const docRef = await addDoc(collection(db, "promotions"), newPromotion);
      newPromotion.uid = docRef.id;

      setPromotionsData((prevData) => [...prevData, newPromotion]);

      toast("success", text[l].success_creation);
    } catch (error) {
      console.error("Error creating promotion:", error);
      toast("danger", text[l].error_creation);
    }
  };
  // RETURN ---------------------------------
  return (
    <PromotionsContext.Provider
      value={{
        promotionsData,
        loadMoreData,
        handleCreatePromotion,
      }}
    >
      {children}
    </PromotionsContext.Provider>
  );
};
