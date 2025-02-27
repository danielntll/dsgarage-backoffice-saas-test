import React, { useContext, useEffect, useState } from "react";
import { ContextLanguage } from "../contextLanguage";
import { AuthContext } from "../contextAuth";
import { ContextToast } from "../systemEvents/contextToast";
import { typePromotion } from "../../types/typePromotion";
import { text } from "./text";
import { useDataContext } from "../contextData";
import { typePromotionModal } from "../../types/typePromotionModal";
import {
  ServicesContextProvider,
  useServicesContext,
} from "../services/contextServices";
import { useIonAlert } from "@ionic/react";
import { getStatusFetch } from "../../utils/getStatusFetch";
import { typeContextStatus } from "../../types/typeContextStatus";
import PromotionsModalCreateAndUpdate from "../../components/Promotions__Modal__CreateAndUpdate/PromotionsModalCreateAndUpdate";
import { typeTarget } from "../../types/typeTarget";

type dataContext = {
  promotionsData: typePromotion[];
  targets: typeTarget[];
  statusInitPromotionData: typeContextStatus;
  statusFetchPromotions: typeContextStatus;
  statusFetchTarghets: typeContextStatus;
  handleCreatePromotion: (
    newPromotion: typePromotion,
    imageFile?: File
  ) => Promise<void>;
  handleAddTarget: (newTarget: string) => Promise<void>;
  handleDeletePromotion: (t: typePromotion) => Promise<void>;
  toggleIsPinned: (t: typePromotion) => Promise<void>;
  toggleIsArchived: (t: typePromotion) => Promise<void>;
  handleEditPromotion: (t: typePromotion, imageFile?: File) => Promise<void>;
  openUpdateModal: (t: typePromotion) => void;
  openCreationModal: () => void;
  initData: () => void;
};

export const PromotionsContext = React.createContext<dataContext>({
  promotionsData: [],
  targets: [],
  statusInitPromotionData: { message: "", status: "notInitializzed" },
  statusFetchPromotions: { message: "", status: "notInitializzed" },
  statusFetchTarghets: { message: "", status: "notInitializzed" },
  handleCreatePromotion: async () => {},
  handleAddTarget: async () => {},
  handleDeletePromotion: async () => {},
  toggleIsPinned: async () => {},
  toggleIsArchived: async () => {},
  handleEditPromotion: async () => {},
  openUpdateModal: () => {},
  openCreationModal: () => {},
  initData: () => {},
});

export const usePromotionsContext = () => React.useContext(PromotionsContext);

export const PromotionsContextProvider = ({ children }: any) => {
  // VARIABLES ------------------------------
  const DEFAULT_PATH = "promotions";
  const DEFAULT_PATH_TARGHETS = "customersTarget";
  const { l } = useContext(ContextLanguage);
  const { authenticateUser } = useContext(AuthContext);
  const { toast, loadingAlert, dismissLoadingAlert } = useContext(ContextToast);
  const {
    getCollectionData,
    addDocument,
    updateDocument,
    deleteDocument,
    uploadFile,
  } = useDataContext();

  const { statusFetch, fetchServices } = useServicesContext();

  const [statusInitPromotionData, setStatusInitPromotionsData] =
    useState<typeContextStatus>(getStatusFetch("notInitializzed", "fetch", l));
  const [statusFetchPromotions, setStatusFetchPromotions] =
    useState<typeContextStatus>(getStatusFetch("notInitializzed", "fetch", l));
  const [statusFetchTarghets, setStatusFetchTarghets] =
    useState<typeContextStatus>(getStatusFetch("notInitializzed", "fetch", l));
  // USE STATE -----------------------------
  const [promotionsData, setPromotionsData] = useState<typePromotion[]>([]);
  const [targets, setTargets] = useState<typeTarget[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<typePromotionModal>({
    isOpen: false,
    mode: "create",
  });
  const [presentAlert] = useIonAlert();
  // USE EFFECT ------------------------------
  // FUNCTIONS ------------------------------
  async function initData() {
    if (authenticateUser !== undefined) {
      setStatusInitPromotionsData(getStatusFetch("loading", "fetch", l));
      try {
        console.log("statusFetch.status: ", statusFetch.status);
        if (statusFetch.status === "notInitializzed") {
          console.log("DO THIS");
          await Promise.all([
            fetchPromotionsData(),
            fetchTargets(),
            fetchServices(),
          ]);
        } else {
          await Promise.all([fetchPromotionsData(), fetchTargets()]);
        }
        setStatusInitPromotionsData(getStatusFetch("success", "fetch", l));
      } catch (error) {
        console.error("Error during initData:", error);
        setStatusInitPromotionsData(getStatusFetch("error", "fetch", l));
      }
    } else {
      setStatusFetchPromotions(getStatusFetch("error", "fetch", l));
      setStatusInitPromotionsData(getStatusFetch("error", "fetch", l));
    }
  }

  const fetchTargets = async () => {
    try {
      setStatusFetchTarghets(getStatusFetch("loading", "fetch", l));
      const targetsData = await getCollectionData<typeTarget>(
        DEFAULT_PATH_TARGHETS
      );
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
    loadingAlert(text[l].loadingFetching);
    try {
      setStatusFetchPromotions(getStatusFetch("loading", "fetch", l));
      const promotions = await getCollectionData<typePromotion>(DEFAULT_PATH);
      setPromotionsData(promotions || []);
    } catch (err) {
      setStatusFetchPromotions(getStatusFetch("error", "fetch", l));
      console.error("Error fetching promozioni data:", err);
      toast("danger", text[l].error_loading);
    } finally {
      setStatusFetchPromotions(getStatusFetch("success", "fetch", l));
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
        const filePath = `/${DEFAULT_PATH}/${
          updatedPromotion.title
        }-${Date.now()}.jpg`; // Adjust path as needed
        imageUrl = await uploadFile(filePath, imageFile);
        if (!imageUrl) {
          throw new Error("Image upload failed");
        }
      }
      const updatedPromo = { ...updatedPromotion, imageUrl };
      await updateDocument<typePromotion>(
        DEFAULT_PATH,
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
      loadingAlert(text[l].loadingCreate);
      if (imageFile) {
        const filePath = `/${DEFAULT_PATH}/${
          newPromotion.title
        }-${Date.now()}.jpg`; // Adjust path as needed
        imageUrl = await uploadFile(filePath, imageFile);
        if (!imageUrl) {
          throw new Error("Image upload failed");
        }
      }
      const newPromo = { ...newPromotion, imageUrl };
      const createdPromotion = await addDocument<typePromotion>(
        DEFAULT_PATH,
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
      loadingAlert(text[l].loadingTarger);
      const newTargetObj: typeTarget = {
        name: newTarget,
      };
      await addDocument(DEFAULT_PATH_TARGHETS, newTargetObj);
      setTargets((prevTargets) => [...prevTargets, newTargetObj]);
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
      await deleteDocument(DEFAULT_PATH, promotionToDelete.uid!);
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

  const toggleIsPinned = async (promotionToToggle: typePromotion) => {
    try {
      await updateDocument<typePromotion>(
        DEFAULT_PATH,
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

  const toggleIsArchived = async (promotionToToggle: typePromotion) => {
    try {
      await updateDocument<typePromotion>(
        DEFAULT_PATH,
        promotionToToggle.uid!,
        {
          isArchived: !promotionToToggle.isArchived,
        }
      );
      setPromotionsData((prevData) =>
        prevData.map((promotion) =>
          promotion.uid === promotionToToggle.uid
            ? { ...promotion, isArchived: !promotion.isArchived }
            : promotion
        )
      );
      toast(
        "success",
        !promotionToToggle.isArchived
          ? text[l].success_hide
          : text[l].success_show
      );
    } catch (error) {
      console.error("Error toggling visibility on promotion:", error);
      toast("danger", text[l].error_visibility);
    }
  };

  const openUpdateModal = (t: typePromotion) => {
    setIsModalOpen({ isOpen: true, mode: "update", promotion: t });
  };

  const openCreationModal = () => {
    setIsModalOpen({ isOpen: true, mode: "create", promotion: undefined });
  };

  // RETURN ---------------------------------
  return (
    <PromotionsContext.Provider
      value={{
        promotionsData,
        targets,
        statusInitPromotionData,
        statusFetchPromotions,
        statusFetchTarghets,
        handleAddTarget,
        handleCreatePromotion,
        handleDeletePromotion,
        toggleIsPinned,
        toggleIsArchived,
        handleEditPromotion,
        openUpdateModal,
        openCreationModal,
        initData,
      }}
    >
      {children}
      <PromotionsModalCreateAndUpdate
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
  );
};
