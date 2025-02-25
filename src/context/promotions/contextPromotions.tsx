import React, { useContext, useEffect, useState } from "react";
import { ContextLanguage } from "../contextLanguage";
import { AuthContext } from "../contextAuth";
import { ContextToast } from "../systemEvents/contextToast";
import { typePromotion } from "../../types/typeTarghet";
import { text } from "./text";
import { useDataContext } from "../contextData";
import PromotionsModalUpdate from "../../components/Promotions__Modal__Update/PromotionsModalUpdate";
import { typePromotionModal } from "../../types/typePromotionModal";
import { ServicesContextProvider } from "../services/contextServices";
import { useIonAlert } from "@ionic/react";
import { getStatusFetch } from "../../utils/getStatusFetch";
import { typeContextStatus } from "../../types/typeContextStatus";

type dataContext = {
  promotionsData: typePromotion[];
  targets: string[];
  handleCreatePromotion: (
    newPromotion: typePromotion,
    imageFile?: File
  ) => Promise<void>;
  handleAddTarget: (newTarget: string) => Promise<void>;
  handleDeletePromotion: (t: typePromotion) => Promise<void>;
  togglePinPromotion: (t: typePromotion) => Promise<void>;
  toggleVisibilityPromotion: (t: typePromotion) => Promise<void>;
  handleEditPromotion: (t: typePromotion, imageFile?: File) => Promise<void>;
  openPromotionModal: (t: typePromotion) => void;
  openCreationModal: () => void;
};

export const PromotionsContext = React.createContext<dataContext>({
  promotionsData: [],
  targets: [],
  handleCreatePromotion: async () => {},
  handleAddTarget: async () => {},
  handleDeletePromotion: async () => {},
  togglePinPromotion: async () => {},
  toggleVisibilityPromotion: async () => {},
  handleEditPromotion: async () => {},
  openPromotionModal: () => {},
  openCreationModal: () => {},
});

export const usePromotionsContext = () => React.useContext(PromotionsContext);

export const PromotionsContextProvider = ({ children }: any) => {
  // VARIABLES ------------------------------
  const { l } = useContext(ContextLanguage);
  const { authenticateUser } = useContext(AuthContext);
  const { toast, loadingAlert, dismissLoadingAlert } = useContext(ContextToast);
  const { getCollectionData, addDocument, updateDocument, deleteDocument } =
    useDataContext();

  const [statusFetch, setStatusFetch] = useState<typeContextStatus>(
    getStatusFetch("loading", "fetch", l)
  );
  const [statusFetchTarghets, setStatusFetchTarghets] =
    useState<typeContextStatus>(getStatusFetch("loading", "fetch", l));
  // USE STATE -----------------------------
  const [promotionsData, setPromotionsData] = useState<typePromotion[]>([]);
  const [targets, setTargets] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<typePromotionModal>({
    isOpen: false,
    mode: "create",
  });
  const [presentAlert] = useIonAlert();
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
      setStatusFetchTarghets(getStatusFetch("loading", "fetch", l));
      const targetsData = await getCollectionData<string>("customersTarget");
      setTargets(targetsData || []);
    } catch (error) {
      console.error("Error fetching targets:", error);
      toast("danger", text[l].error_target_load);
      setStatusFetchTarghets(getStatusFetch("error", "fetch", l));
    } finally {
      setStatusFetchTarghets(getStatusFetch("success", "fetch", l));
    }
  };

  const fetchPromotionsData = async () => {
    loadingAlert(text[l].loading);
    try {
      setStatusFetch(getStatusFetch("loading", "fetch", l));
      const promotions = await getCollectionData<typePromotion>("promotions");
      setPromotionsData(promotions || []);
    } catch (err) {
      setStatusFetch(getStatusFetch("error", "fetch", l));
      console.error("Error fetching promozioni data:", err);
      toast("danger", text[l].error_loading);
    } finally {
      setStatusFetch(getStatusFetch("success", "fetch", l));
      dismissLoadingAlert();
    }
  };

  const handleEditPromotion = async (
    updatedPromotion: typePromotion,
    imageFile?: File
  ) => {
    let imageUrl: string | null | undefined = updatedPromotion.imageUrl; // Keep existing URL

    try {
      loadingAlert(text[l].updating);
      if (imageFile) {
        const filePath = `/promotions/${
          updatedPromotion.title
        }-${Date.now()}.jpg`; // Adjust path as needed
        imageUrl = await useDataContext().uploadFile(filePath, imageFile);
        if (!imageUrl) {
          throw new Error("Image upload failed");
        }
      }
      const updatedPromo = { ...updatedPromotion, imageUrl };
      await updateDocument<typePromotion>(
        "promotions",
        updatedPromotion.uid!,
        updatedPromo
      );
      setPromotionsData((prevData) =>
        prevData.map((promotion) =>
          promotion.uid === updatedPromotion.uid ? updatedPromo : promotion
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

  const handleCreatePromotion = async (
    newPromotion: typePromotion,
    imageFile?: File
  ) => {
    let imageUrl: string | null = null;

    try {
      loadingAlert(text[l].loading);
      if (imageFile) {
        const filePath = `/promotions/${newPromotion.title}-${Date.now()}.jpg`; // Adjust path as needed
        imageUrl = await useDataContext().uploadFile(filePath, imageFile);
        if (!imageUrl) {
          throw new Error("Image upload failed");
        }
      }
      const newPromo = { ...newPromotion, imageUrl };
      const createdPromotion = await addDocument<typePromotion>(
        "promotions",
        newPromo
      );
      if (createdPromotion) {
        setPromotionsData((prevData) => [...prevData, createdPromotion]);
        toast("success", text[l].success_creation);
      }
    } catch (error) {
      console.error("Error creating promotion:", error);
      toast("danger", text[l].error_creation);
    } finally {
      dismissLoadingAlert();
    }
  };
  const handleAddTarget = async (newTarget: string) => {
    try {
      loadingAlert(text[l].loading);
      await addDocument("customersTarget", { name: newTarget });
      setTargets((prevTargets) => [...prevTargets, newTarget]);
      toast("success", text[l].success_target_add);
    } catch (error) {
      console.error("Error adding target:", error);
      toast("danger", text[l].error_target_add);
    } finally {
      dismissLoadingAlert();
    }
  };

  const deletePromotion = async (promotionToDelete: typePromotion) => {
    try {
      loadingAlert(text[l].deleting);
      await deleteDocument("promotions", promotionToDelete.uid!);
      setPromotionsData((prevData) =>
        prevData.filter((promotion) => promotion.uid !== promotionToDelete.uid)
      );
      toast("success", text[l].success_delete);
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast("danger", text[l].error_delete);
    } finally {
      dismissLoadingAlert();
    }
  };

  const handleDeletePromotion = async (dataToDelete: typePromotion) => {
    presentAlert({
      header: text[l].delete__alert__header,
      message: text[l].delete__alert__message,
      buttons: [
        {
          text: text[l].btn__annulla,
          role: "cancel",
        },
        {
          text: text[l].btn__delete,
          role: "confirm",
          cssClass: "alert-button-delete",
          handler: () => {
            deletePromotion(dataToDelete);
          },
        },
      ],
    });
  };

  const togglePinPromotion = async (promotionToToggle: typePromotion) => {
    try {
      await updateDocument<typePromotion>(
        "promotions",
        promotionToToggle.uid!,
        {
          isPinned: !promotionToToggle.isPinned,
        }
      );
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
      );
    } catch (error) {
      console.error("Error toggling pin on promotion:", error);
      toast("danger", text[l].error_pin);
    }
  };

  const toggleVisibilityPromotion = async (
    promotionToToggle: typePromotion
  ) => {
    try {
      await updateDocument<typePromotion>(
        "promotions",
        promotionToToggle.uid!,
        {
          isArchived: !promotionToToggle.isArchived,
        }
      );
      setPromotionsData((prevData) =>
        prevData.map((promotion) =>
          promotion.uid === promotionToToggle.uid
            ? { ...promotion, isVisible: !promotion.isArchived }
            : promotion
        )
      );
      toast(
        "success",
        promotionToToggle.isArchived
          ? text[l].success_hide
          : text[l].success_show
      );
    } catch (error) {
      console.error("Error toggling visibility on promotion:", error);
      toast("danger", text[l].error_visibility);
    }
  };

  const openPromotionModal = (t: typePromotion) => {
    setIsModalOpen({ isOpen: true, mode: "update", promotion: t });
  };

  const openCreationModal = () => {
    setIsModalOpen({ isOpen: true, mode: "create", promotion: undefined });
  };

  // RETURN ---------------------------------
  return (
    <ServicesContextProvider>
      <PromotionsContext.Provider
        value={{
          promotionsData,
          handleAddTarget,
          targets,
          handleCreatePromotion,
          handleDeletePromotion,
          togglePinPromotion,
          toggleVisibilityPromotion,
          handleEditPromotion,
          openPromotionModal,
          openCreationModal,
        }}
      >
        {children}
        <PromotionsModalUpdate
          showModal={isModalOpen.isOpen}
          setShowModal={() =>
            setIsModalOpen({
              isOpen: false,
              mode: "create",
              promotion: undefined,
            })
          }
          type={isModalOpen.mode}
          promotionToUpdate={isModalOpen.promotion}
        />
      </PromotionsContext.Provider>
    </ServicesContextProvider>
  );
};
