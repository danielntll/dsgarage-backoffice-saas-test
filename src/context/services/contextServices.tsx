import React, { useContext, useEffect, useState } from "react";
import { typeService } from "../../types/typeService";
import { ContextToast } from "../systemEvents/contextToast";
import { ContextLanguage } from "../contextLanguage";
import { useDataContext } from "../contextData";
import { text } from "./text";
import ServicesModalUpdate from "../../components/Services__Modal__Update/ServicesModalUpdate";
import { useIonAlert } from "@ionic/react";
import { typeContextStatus } from "../../types/typeContextStatus";
import { getStatusFetch } from "../../utils/getStatusFetch";

type dataContext = {
  services: typeService[];
  statusFetch: typeContextStatus;
  statusUpdate: typeContextStatus;
  statusCreate: typeContextStatus;
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
  statusFetch: { status: "notInitializzed", message: "" },
  statusUpdate: { status: "notInitializzed", message: "" },
  statusCreate: { status: "notInitializzed", message: "" },
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
  const DEFALUT_PATH = "services";
  const { toast, loadingAlert, dismissLoadingAlert } = useContext(ContextToast);
  const { l } = useContext(ContextLanguage);
  const {
    addDocument,
    updateDocument,
    deleteDocument,
    uploadFile,
    getCollectionData,
    deleteFile,
  } = useDataContext();

  const [statusFetch, setStatusFetch] = useState<typeContextStatus>(
    getStatusFetch("notInitializzed", "fetch", l)
  );
  const [statusUpdate, setStatusUpdate] = useState<typeContextStatus>(
    getStatusFetch("notInitializzed", "update", l)
  );
  const [statusCreate, setStatusCreate] = useState<typeContextStatus>(
    getStatusFetch("notInitializzed", "upload", l)
  );

  // USE STATE ------------------------------
  const [services, setServices] = useState<typeService[]>([]);
  const [presentAlert] = useIonAlert();

  // ------- update service
  const [showModal, setShowModal] = useState(false);
  const [serviceToUpdate, setServiceToUpdate] = useState<
    typeService | undefined
  >(undefined);

  // USE EFFECT -----------------------------
  // FUNCTIONS ------------------------------
  const handleUpdateService = (srvToUpdate: typeService) => {
    if (srvToUpdate) {
      setServiceToUpdate(srvToUpdate);
      setShowModal(true);
    }
  };
  const fetchServices = async () => {
    try {
      setStatusFetch(getStatusFetch("loading", "fetch", l));
      const servicesData = await getCollectionData<typeService>(DEFALUT_PATH);
      if (servicesData) {
        setServices(servicesData);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast("danger", text[l].error_services_load);
      setStatusFetch(getStatusFetch("error", "fetch", l));
    } finally {
      setStatusFetch(getStatusFetch("success", "fetch", l));
    }
  };

  const createService = async (newService: typeService, imageFile?: File) => {
    try {
      setStatusCreate(getStatusFetch("loading", "upload", l));
      loadingAlert(text[l].loading);
      let imageUrl = "";
      let fileUID = "";
      if (imageFile) {
        fileUID = imageFile.name + new Date().getTime();
        imageUrl =
          (await uploadFile(`${DEFALUT_PATH}/${fileUID}`, imageFile)) || "";
      }

      const serviceWithTimestamp: typeService = {
        ...newService,
        image: {
          url: imageUrl,
          uid: fileUID,
        },
      };

      const newServiceData = await addDocument<typeService>(
        DEFALUT_PATH,
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
      setStatusCreate(getStatusFetch("error", "upload", l));
    } finally {
      setStatusCreate(getStatusFetch("success", "upload", l));
      dismissLoadingAlert();
    }
  };

  const updateService = async (
    updatedService: typeService,
    imageFile?: File
  ) => {
    try {
      setStatusUpdate(getStatusFetch("loading", "update", l));
      loadingAlert(text[l].loading);
      let imageUrl = updatedService.image?.url || "";
      let fileUID = updatedService.image?.uid || "";

      if (imageFile) {
        // Eliminazione file precedente.
        await deleteFile(`${DEFALUT_PATH}/${fileUID}`);

        // Sostituzione con nuovo file.
        fileUID = imageFile.name + new Date().getTime();
        imageUrl =
          (await uploadFile(`${DEFALUT_PATH}/${fileUID}`, imageFile)) || "";
      }

      const serviceWithTimestamp: typeService = {
        ...updatedService,
        image: {
          url: imageUrl,
          uid: fileUID,
        },
      };

      await updateDocument(
        DEFALUT_PATH,
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
      setStatusUpdate(getStatusFetch("error", "update", l));
    } finally {
      setStatusUpdate(getStatusFetch("success", "update", l));
      dismissLoadingAlert();
    }
  };

  const deleteService = async (serviceToDelete: typeService) => {
    try {
      loadingAlert(text[l].loading);
      // Delete image if it exists
      if (serviceToDelete.image) {
        await deleteFile(serviceToDelete.uid!);
      }
      await deleteDocument(DEFALUT_PATH, serviceToDelete.uid!);
      toast("success", text[l].success_services_delete);
      setServices((prevServices) =>
        prevServices.filter((service) => service.uid !== serviceToDelete.uid)
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
            deleteService(serviceToDelete);
          },
        },
      ],
    });
  };

  const togglePinned = async (service: typeService) => {
    try {
      setStatusUpdate(getStatusFetch("loading", "update", l));
      loadingAlert(text[l].loading);
      const updatedService = { ...service, isPinned: !service.isPinned };
      await updateDocument(DEFALUT_PATH, service.uid!, updatedService);
      setServices((prevServices) =>
        prevServices.map((s) => (s.uid === service.uid ? updatedService : s))
      );
      toast("success", text[l].success_services_update);
    } catch (error) {
      console.error("Error toggling pinned status:", error);
      toast("danger", text[l].error_services_update);
      setStatusUpdate(getStatusFetch("error", "update", l));
    } finally {
      setStatusUpdate(getStatusFetch("success", "update", l));
      dismissLoadingAlert();
    }
  };

  const toggleArchived = async (service: typeService) => {
    try {
      setStatusUpdate(getStatusFetch("loading", "update", l));
      loadingAlert(text[l].loading);
      const updatedService = { ...service, isArchived: !service.isArchived };
      await updateDocument(DEFALUT_PATH, service.uid!, updatedService);
      setServices((prevServices) =>
        prevServices.map((s) => (s.uid === service.uid ? updatedService : s))
      );
      toast("success", text[l].success_services_update);
    } catch (error) {
      console.error("Error toggling archived status:", error);
      toast("danger", text[l].error_services_update);
      setStatusUpdate(getStatusFetch("error", "update", l));
    } finally {
      setStatusUpdate(getStatusFetch("success", "update", l));
      dismissLoadingAlert();
    }
  };

  // RETURN ---------------------------------
  return (
    <ServicesContext.Provider
      value={{
        services,
        statusFetch,
        statusUpdate,
        statusCreate,
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
