import React, { useContext, useEffect, useState } from "react";
import { ContextLanguage } from "./contextLanguage";
import { AuthContext } from "./contextAuth";
import { ContextToast } from "./contextToast";
import { addDoc, collection, doc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase/firebaseConfig";
import { typeImage } from "../types/typeImage";
import { useIonAlert } from "@ionic/react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

type galleryContext = {
  galleryData: typeImage[];
  loading: boolean;
  error: any;
  pinnedImages: typeImage[];
  fetchGalleryData: () => Promise<void>;
  togglePinImage: (image: typeImage) => Promise<void>;
  toggleVisibilityImage: (image: typeImage) => Promise<void>;
  handleSaveEdit: (
    editedImage: typeImage,
    editedAlt: string,
    editedDescription: string
  ) => Promise<boolean>;
  handleUploadImages : (files:File[]) => Promise<boolean>
};

export const GalleryContext = React.createContext<galleryContext>({
  galleryData: [],
  loading: true,
  error: null,
  pinnedImages: [],
  fetchGalleryData: async () => {},
  togglePinImage: async () => {},
  toggleVisibilityImage: async () => {},
  handleSaveEdit: async () => {
    return false;
  },
  handleUploadImages : async () => {
    return false;
  }
});

export const useGalleryContext = () => React.useContext(GalleryContext);

export const GalleryContextProvider = ({ children }: any) => {
  // VARIABLES ------------------------------
  const { l } = useContext(ContextLanguage);
  const { authenticateUser } = useContext(AuthContext);
  const { toast } = useContext(ContextToast);

  const [galleryData, setGalleryData] = useState<typeImage[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<any>(null);

  const [pinnedImages, setPinnedData] = useState<typeImage[]>([]);
  const [presentAlert] = useIonAlert();
  // -----------------------------

  // USE EFFECT ------------------------------
  useEffect(() => {
    if (authenticateUser !== undefined) {
      fetchGalleryData();
    }
  }, [authenticateUser]);
  // FUNCTIONS ------------------------------
  const handleUploadImages = async (
    imagesToUpload: File[]
  ) => {
    if (!imagesToUpload || imagesToUpload.length === 0) {
      toast("danger", "No images selected");
      return false;
    }

    try {
      const uploadPromises = imagesToUpload.map(async (image) => {
        const storageRef = ref(storage, `/gallery/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        return new Promise<typeImage>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {},
            (error) => {
              console.error("Upload failed:", error);
              toast("danger", "Upload failed");
              reject(error); // Reject the promise if upload fails
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const newImage: typeImage = {
                imageUrl: downloadURL,
                alt: "",
                description: "",
                isVisible: true,
                isPinned: false,
                createdAt: Timestamp.now(),
                uid: "", // This will be populated by Firestore
              };

              const docRef = await addDoc(collection(db, "gallery"), newImage);
              newImage.uid = docRef.id;

              resolve(newImage); // Resolve with the image data
            }
          );
        });
      });

      const uploadedImages = await Promise.all(uploadPromises);
      toast("success", "Images uploaded successfully");

      
       // Update local state directly after successful uploads
       setGalleryData((prevData) => [...prevData, ...uploadedImages]);

       // Update pinned images if any new image is pinned
       const newPinnedImages = uploadedImages.filter(image => image.isPinned);
       if (newPinnedImages.length > 0) {
         setPinnedData((prevData) => [...prevData, ...newPinnedImages]);
       }

       return true;
 
    } catch (error) {
      console.error("Error uploading images:", error);
      return false;
    }
  }


  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      const galleryRef = collection(db, "gallery");
      const gallerySnapshot = await getDocs(galleryRef);

      const galleryDataList: any[] = [];
      const pinnedImagesList: any[] = [];

      gallerySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        data.uid = doc.id;

        galleryDataList.push(data);

        if (data.isPinned) {
          pinnedImagesList.push(data);
        }
      });

      setGalleryData(galleryDataList);
      setPinnedData(pinnedImagesList);
    } catch (err) {
      setError(err);
      console.error("Error fetching gallery data:", err);
      toast("danger", "Error loading gallery data");
    } finally {
      setLoading(false);
    }
  };

  const togglePinImage = async (image: typeImage) => {
    try {
      const imageRef = doc(db, "gallery", image.uid);
      if (!image.isPinned) {
        // If NOT pinned already
        await updateDoc(imageRef, {
          isPinned: true,
        });

        // Update local state after successful backend update
        setGalleryData((prevData) =>
          prevData.map((item) =>
            item.uid === image.uid ? { ...item, isPinned: true } : item
          )
        );
        setPinnedData((prevData) =>
          prevData
            ? [...prevData, { ...image, isPinned: true }]
            : [{ ...image, isPinned: true }]
        );
        toast("success", "Immagine aggiunta");
      } else {
        // If already pinned
        await updateDoc(imageRef, {
          isPinned: false,
        });

        // Update local state: remove from pinnedImages, update isPinned in galleryData
        setPinnedData((prevData) =>
          prevData.filter((item) => item.uid !== image.uid)
        );
        setGalleryData((prevData) =>
          prevData.map((item) =>
            item.uid === image.uid ? { ...item, isPinned: false } : item
          )
        );
        toast("success", "Immagine rimossa");
      }
    } catch (error) {
      console.error("Error pinning image:", error);
      toast("danger", "Error pinning image");
    }
  };

  const toggleVisibilityAndCheckPinned = async (image: typeImage) => {
    try {
      const imageRef = doc(db, "gallery", image.uid);
      if (!image.isVisible) {
        // If NOT pinned already
        await updateDoc(imageRef, {
          isVisible: true,
        });
        // Update local state after successful backend update
        setGalleryData((prevData) =>
          prevData.map((item) =>
            item.uid === image.uid ? { ...item, isVisible: true } : item
          )
        );
        toast("success", "Immagine visibile nella galleria");
      } else {
        // If already pinned
        await updateDoc(imageRef, {
          isVisible: false,
        });
        // Update local state after successful backend update
        setGalleryData((prevData) =>
          prevData.map((item) =>
            item.uid === image.uid ? { ...item, isVisible: false } : item
          )
        );
        toast("success", "Immagine nascosta");
      }
    } catch (error) {
      console.error("Error pinning image:", error);
      toast("danger", "Error pinning image");
    }
  };
  const toggleVisibilityImage = async (image: typeImage) => {
    if (image.isPinned && image.isVisible) {
      presentAlert({
        header: "Attenzione",
        subHeader: "Immagine in evidenza",
        message:
          "Questa immagine risulta nella lista delle immagini in evidenza, nascondere l'immagine comporta la rimozione dalla lista delle immagini in evidenza",
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
            handler: () => {
              toggleVisibilityAndCheckPinned(image);
              togglePinImage(image);
            },
          },
        ],
      });
    } else {
      toggleVisibilityAndCheckPinned(image);
    }
  };

  const handleSaveEdit = async (
    editedImage: typeImage,
    editedAlt: string,
    editedDescription: string
  ): Promise<boolean> => {
    if (!editedImage) return false;

    try {
      const imageRef = doc(db, "gallery", editedImage.uid);
      await updateDoc(imageRef, {
        alt: editedAlt,
        description: editedDescription,
      });

      // Update local state directly
      setGalleryData((prevData) =>
        prevData.map((item) =>
          item.uid === editedImage.uid
            ? { ...item, alt: editedAlt, description: editedDescription }
            : item
        )
      );

      // Update pinnedImages if necessary
      if (editedImage.isPinned) {
        setPinnedData((prevData) =>
          prevData.map((item) =>
            item.uid === editedImage.uid
              ? { ...item, alt: editedAlt, description: editedDescription }
              : item
          )
        );
      }

      toast("success", "Image updated successfully");
      return false;
    } catch (error) {
      console.error("Error updating image:", error);
      toast("danger", "Error updating image");
    }
    return false;
  };

  // RETURN ---------------------------------
  return (
    <GalleryContext.Provider
      value={{
        galleryData,
        loading,
        error,
        pinnedImages,
        fetchGalleryData,
        togglePinImage,
        toggleVisibilityImage,
        handleSaveEdit,
        handleUploadImages,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};
