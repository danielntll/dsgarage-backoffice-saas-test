import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contextAuth";
import { typeService } from "../../types/typeService";
import { ContextToast } from "../systemEvents/contextToast";
import { ContextLanguage } from "../contextLanguage";
import { useDataContext } from "../contextData";
import { text } from "./text";
import ServicesModalUpdate from "../../components/Services__Modal__Update/ServicesModalUpdate";
import { useIonAlert } from "@ionic/react";

type dataContext = {
  services: typeService[];
  loadingServices: boolean;
  fetchServices: () => Promise<void>;
  createService: (newService: typeService, imageFile?: File) => Promise<void>;
  handleUpdateService: (srvToUpdate: typeService) => void;
  handleDeleteService: (srvToDelete: typeService) => void;
  togglePinned: (srvToUpdate: typeService) => void;
  toggleArchived: (srvToUpdate: typeService) => void;
  updateService: (
    updatedService: typeService,
    imageFile?: File
  ) => Promise<void>;
};

export const ServicesContext = React.createContext<dataContext>({
  services: [],
  loadingServices: true,
  fetchServices: async () => {},
  createService: async () => {},
  updateService: async () => {},
  handleUpdateService: () => {},
  handleDeleteService: () => {},
  toggleArchived: () => {},
  togglePinned: () => {},
});

export const useServicesContext = () => React.useContext(ServicesContext);

export const ServicesContextProvider = ({ children }: any) => {
  // VARIABLES ------------------------------
  const { authenticateUser } = useContext(AuthContext);
  const { toast, loadingAlert, dismissLoadingAlert } = useContext(ContextToast);
  const { l } = useContext(ContextLanguage);
  const {
    addDocument,
    updateDocument,
    deleteDocument,
    uploadFile,
    getCollectionData,
  } = useDataContext();

  // USE STATE ------------------------------
  const [services, setServices] = useState<typeService[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [presentAlert] = useIonAlert();

  // ------- update service
  const [showModal, setShowModal] = useState(false);
  const [serviceToUpdate, setServiceToUpdate] = useState<
    typeService | undefined
  >(undefined);

  // USE EFFECT -----------------------------
  useEffect(() => {
    if (authenticateUser !== undefined) {
      fetchServices();
    }
  }, [authenticateUser]);
  // FUNCTIONS ------------------------------
  const handleUpdateService = (srvToUpdate: typeService) => {
    if (srvToUpdate) {
      setServiceToUpdate(srvToUpdate);
      setShowModal(true);
    }
  };
  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const servicesData = await getCollectionData<typeService>("services");
      if (servicesData) {
        setServices(servicesData);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast("danger", text[l].error_services_load);
    } finally {
      setLoadingServices(false);
    }
  };

  const createService = async (newService: typeService, imageFile?: File) => {
    try {
      loadingAlert(text[l].loading);
      let imageUrl = "";
      if (imageFile) {
        imageUrl =
          (await uploadFile(`services/${imageFile.name}`, imageFile)) || "";
      }

      const serviceWithTimestamp: typeService = {
        ...newService,
        imageUrl: imageUrl,
      };

      const newServiceData = await addDocument<typeService>(
        "services",
        serviceWithTimestamp
      );
      if (newServiceData) {
        setServices((prevServices: typeService[]) => [
          ...prevServices,
          newServiceData,
        ]);
        toast("success", text[l].success_services_creation);
      }
    } catch (error) {
      console.error("Error creating service:", error);
      toast("danger", text[l].error_services_creation);
    } finally {
      dismissLoadingAlert();
    }
  };

  const updateService = async (
    updatedService: typeService,
    imageFile?: File
  ) => {
    try {
      loadingAlert(text[l].loading);
      let imageUrl = updatedService.imageUrl;

      if (imageFile) {
        imageUrl =
          (await uploadFile(`services/${imageFile.name}`, imageFile)) || "";
      }

      const serviceWithTimestamp: typeService = {
        ...updatedService,
        imageUrl,
      };

      await updateDocument(
        "services",
        updatedService.uid!,
        serviceWithTimestamp
      );
      toast("success", text[l].success_services_update);
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.uid === updatedService.uid ? serviceWithTimestamp : service
        )
      );
    } catch (error) {
      console.error("Error updating service:", error);
      toast("danger", text[l].error_services_update);
    } finally {
      dismissLoadingAlert();
    }
  };

  const deleteService = async (serviceId: string) => {
    try {
      loadingAlert(text[l].loading);
      await deleteDocument("services", serviceId);
      toast("success", text[l].success_services_delete);
      setServices((prevServices) =>
        prevServices.filter((service) => service.uid !== serviceId)
      );
    } catch (error) {
      console.error("Error deleting service:", error);
      toast("danger", text[l].error_services_delete);
    } finally {
      dismissLoadingAlert();
    }
  };

  const handleDeleteService = (serviceToDelete: typeService) => {
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
            deleteService(serviceToDelete.uid!);
          },
        },
      ],
    });
  };

  const togglePinned = async (service: typeService) => {
    try {
      loadingAlert(text[l].loading);
      const updatedService = { ...service, isPinned: !service.isPinned };
      await updateDocument("services", service.uid!, updatedService);
      setServices((prevServices) =>
        prevServices.map((s) => (s.uid === service.uid ? updatedService : s))
      );
      toast("success", text[l].success_services_update);
    } catch (error) {
      console.error("Error toggling pinned status:", error);
      toast("danger", text[l].error_services_update);
    } finally {
      dismissLoadingAlert();
    }
  };

  const toggleArchived = async (service: typeService) => {
    try {
      loadingAlert(text[l].loading);
      const updatedService = { ...service, isArchived: !service.isArchived };
      await updateDocument("services", service.uid!, updatedService);
      setServices((prevServices) =>
        prevServices.map((s) => (s.uid === service.uid ? updatedService : s))
      );
      toast("success", text[l].success_services_update);
    } catch (error) {
      console.error("Error toggling archived status:", error);
      toast("danger", text[l].error_services_update);
    } finally {
      dismissLoadingAlert();
    }
  };

  // RETURN ---------------------------------
  return (
    <ServicesContext.Provider
      value={{
        services,
        loadingServices,
        fetchServices,
        createService,
        handleUpdateService,
        handleDeleteService,
        toggleArchived,
        togglePinned,
        updateService,
      }}
    >
      {children}
      <ServicesModalUpdate
        showModal={showModal}
        setShowModal={setShowModal}
        serviceToUpdate={serviceToUpdate}
      />
    </ServicesContext.Provider>
  );
};
