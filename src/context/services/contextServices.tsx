import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contextAuth";
import { typeService } from "../../types/typeService";
import { ContextToast } from "../systemEvents/contextToast";
import { ContextLanguage } from "../contextLanguage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { text } from "./text";

type dataContext = {
  services: typeService[];
  loadingServices: boolean;
  fetchServices: () => Promise<void>;
  createService: (newService: typeService, imageFile?: File) => Promise<void>;
  updateService: (
    updatedService: typeService,
    imageFile?: File
  ) => Promise<void>;
  deleteService: (serviceId: string) => Promise<void>;
};

export const ServicesContext = React.createContext<dataContext>({
  services: [],
  loadingServices: true,
  fetchServices: async () => {},
  createService: async () => {},
  updateService: async () => {},
  deleteService: async () => {},
});

export const useServicesContext = () => React.useContext(ServicesContext);

export const ServicesContextProvider = ({ children }: any) => {
  // VARIABLES ------------------------------
  const { authenticateUser } = useContext(AuthContext);
  const { toast, loadingAlert, dismissLoadingAlert } = useContext(ContextToast);
  const { l } = useContext(ContextLanguage);

  // USE STATE ------------------------------
  const [services, setServices] = useState<typeService[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  // USE EFFECT -----------------------------
  useEffect(() => {
    if (authenticateUser !== undefined) {
      fetchServices();
    }
  }, [authenticateUser]);
  // FUNCTIONS ------------------------------
  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const servicesCollection = collection(db, "services");
      const q = query(servicesCollection, orderBy("createdAt", "desc"));
      const servicesSnapshot = await getDocs(q);
      const servicesData = servicesSnapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      })) as typeService[];

      setServices(servicesData);
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
        const storageRef = ref(storage, `services/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const serviceWithTimestamp = {
        ...newService,
        imageUrl: imageUrl,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(
        collection(db, "services"),
        serviceWithTimestamp
      );
      toast("success", text[l].success_services_creation);

      setServices((prevServices) => [
        ...prevServices,
        { ...serviceWithTimestamp, id: docRef.id },
      ]);
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

      let imageUrl = updatedService.imageUrl; // Keep existing image URL

      if (imageFile) {
        // If a new image is provided, upload and update
        const storageRef = ref(storage, `services/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef); // Update URL
      }

      const serviceWithTimestamp = {
        ...updatedService,
        imageUrl: imageUrl, // Update with the correct image URL
      };

      // Update in Firestore and update state

      const serviceRef = doc(db, "services", updatedService.uid);
      await updateDoc(serviceRef, serviceWithTimestamp);
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
      await deleteDoc(doc(db, "services", serviceId));
      toast("success", text[l].success_services_delete);
      // Update state after successful deletion
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

  // RETURN ---------------------------------
  return (
    <ServicesContext.Provider
      value={{
        services,
        loadingServices,
        fetchServices,
        createService,
        updateService,
        deleteService,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};
