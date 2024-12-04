import React, { useContext, useEffect, useState } from "react";
import { ContextLanguage } from "../contextLanguage";
import { AuthContext } from "../contextAuth";
import { ContextToast } from "../systemEvents/contextToast";
import { typePromotion } from "../../types/typeTarghet";
import { text } from "./text";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

type dataContext = {
  promotionsData: typePromotion[];
  targets: string[];
  loadMoreData: () => Promise<void>;
  handleCreatePromotion: (newPromotion: typePromotion) => Promise<void>;
  handleAddTarget: (newTarget: string) => Promise<void>;
  handleDeletePromotion: (t: typePromotion) => Promise<void>;
  togglePinPromotion: (t: typePromotion) => Promise<void>;
  toggleVisibilityPromotion: (t: typePromotion) => Promise<void>;
  handleEditPromotion: (t: typePromotion) => Promise<void>;
};

export const PromotionsContext = React.createContext<dataContext>({
  promotionsData: [],
  targets: [],
  loadMoreData: async () => {},
  handleCreatePromotion: async () => {},
  handleAddTarget: async () => {},
  handleDeletePromotion: async () => {},
  togglePinPromotion: async () => {},
  toggleVisibilityPromotion: async () => {},
  handleEditPromotion: async () => {},
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

  const [targets, setTargets] = useState<string[]>([]); // State to store targets
  const [loadingTargets, setLoadingTargets] = useState(true); // Loading state for targets

  // USE EFFECT ------------------------------
  useEffect(() => {
    if (authenticateUser !== undefined) {
      fetchPromotionsData();
      fetchTargets();
    }
  }, [authenticateUser]);
  // FUNCTIONS ------------------------------

  const fetchTargets = async () => {
    try {
      setLoadingTargets(true); // Set loading to true before fetching

      const targetsCollection = collection(db, "customersTarget");
      const targetsSnapshot = await getDocs(targetsCollection);

      const targetsData = targetsSnapshot.docs.map(
        (doc) => doc.data().name as string
      );
      setTargets(targetsData); // Update the state with fetched targets
    } catch (error) {
      console.error("Error fetching targets:", error);
      toast("danger", text[l].error_target_load);
      // Handle error as needed (e.g., show error message)
    } finally {
      setLoadingTargets(false); // Set loading to false after fetching, regardless of success/failure
    }
  };

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
      newData.length === 0 && toast("success", text[l].success_loading);
    } catch (err) {
      dismissLoadingAlert();
      setError(err);
      console.error("Error fetching promozioni data:", err);
      toast("danger", text[l].error_loading);
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

  const handleAddTarget = async (newTarget: string) => {
    try {
      loadingAlert(text[l].loading);
      // 1. Check if target already exists
      const targetRef = doc(db, "customersTarget", newTarget);
      const targetSnap = await getDoc(targetRef);

      if (targetSnap.exists()) {
        // Target already exists, do not add it and throw an error
        toast("danger", text[l].error_target_exists);
        throw new Error("Target already exists"); // Or handle differently
      } else {
        // 2. Add new target if it doesn't exist
        await setDoc(targetRef, { name: newTarget }); // Add other fields as needed

        setTargets((prevTargets) => [...prevTargets, newTarget]); // Update targets state

        // 3. Refetch targets and show success toast
        toast("success", text[l].success_target_add);
      }
    } catch (error) {
      console.error("Error adding target:", error);
      toast("danger", text[l].error_target_add);
    } finally {
      dismissLoadingAlert();
    }
  };

  const handleDeletePromotion = async (promotionToDelete: typePromotion) => {
    try {
      loadingAlert(text[l].deleting); // Show loading alert
      const promotionRef = doc(db, "promotions", promotionToDelete.uid);
      await deleteDoc(promotionRef);

      setPromotionsData((prevData) =>
        prevData.filter((promotion) => promotion.uid !== promotionToDelete.uid)
      );
      toast("success", text[l].success_delete);
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast("danger", text[l].error_delete);
    } finally {
      dismissLoadingAlert(); // Dismiss loading alert in all cases
    }
  };

  const togglePinPromotion = async (promotionToToggle: typePromotion) => {
    try {
      const promotionRef = doc(db, "promotions", promotionToToggle.uid);
      await updateDoc(promotionRef, { isPinned: !promotionToToggle.isPinned });

      setPromotionsData((prevData) =>
        prevData.map((promotion) =>
          promotion.uid === promotionToToggle.uid
            ? { ...promotion, isPinned: !promotion.isPinned }
            : promotion
        )
      );

      toast(
        "success",
        promotionToToggle.isPinned ? text[l].success_unpin : text[l].success_pin
      ); // Show appropriate toast message
    } catch (error) {
      console.error("Error toggling pin on promotion:", error);
      toast("danger", text[l].error_pin); // Generic error message
    }
  };

  const toggleVisibilityPromotion = async (
    promotionToToggle: typePromotion
  ) => {
    try {
      const promotionRef = doc(db, "promotions", promotionToToggle.uid);
      await updateDoc(promotionRef, {
        isVisible: !promotionToToggle.isVisible,
      });

      setPromotionsData((prevData) =>
        prevData.map((promotion) =>
          promotion.uid === promotionToToggle.uid
            ? { ...promotion, isVisible: !promotion.isVisible }
            : promotion
        )
      );

      toast(
        "success",
        promotionToToggle.isVisible
          ? text[l].success_hide
          : text[l].success_show
      ); // Show appropriate toast message
    } catch (error) {
      console.error("Error toggling visibility on promotion:", error);

      toast("danger", text[l].error_visibility);
    }
  };

  const handleEditPromotion = async (updatedPromotion: typePromotion) => {
    try {
      loadingAlert(text[l].updating);
      const promotionRef = doc(db, "promotions", updatedPromotion.uid);
      await updateDoc(promotionRef, updatedPromotion); // No need to spread, just pass the updated object

      setPromotionsData((prevData) =>
        prevData.map((promotion) =>
          promotion.uid === updatedPromotion.uid
            ? updatedPromotion // Directly use the updated promotion
            : promotion
        )
      );

      toast("success", text[l].success_update);
    } catch (error) {
      console.error("Error updating promotion:", error);
      toast("danger", text[l].error_update);
    } finally {
      dismissLoadingAlert();
    }
  };

  // RETURN ---------------------------------
  return (
    <PromotionsContext.Provider
      value={{
        promotionsData,
        loadMoreData,
        handleAddTarget,
        targets,
        handleCreatePromotion,
        handleDeletePromotion,
        togglePinPromotion,
        toggleVisibilityPromotion,
        handleEditPromotion,
      }}
    >
      {children}
    </PromotionsContext.Provider>
  );
};
