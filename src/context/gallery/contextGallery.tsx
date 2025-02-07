import React, { useContext, useState } from "react";
import { ContextLanguage } from "../contextLanguage";
import { AuthContext } from "../contextAuth";
import { ContextToast } from "../systemEvents/contextToast";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../../firebase/firebaseConfig";
import { typeImage } from "../../types/typeImage";
import { useIonAlert, useIonLoading } from "@ionic/react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { typeImageToUpload } from "../../types/typeImageToUpload";
import { text } from "./text";
import ImageOverlay from "../../components/Image__Overlay/ImageOverlay";
import ImageModalModify from "../../components/Image__Modal__Modify/ImageModalModify";
import { typeImageUploadData } from "../../types/typeImageUploadData";
import { useDataContext } from "../contextData";

type galleryContext = {
  galleryData: typeImage[] | null;
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
  handleUploadImages: (
    _imagesToUpload: File[],
    _imageDetails: typeImageUploadData
  ) => Promise<typeImage[] | null>;
  handleDeleteImage: (image: typeImage) => Promise<void>;
  handleShowImageOverlay: (image: typeImage) => void;
  handleEditClick: (image: typeImage) => void;
  loadMoreData: () => Promise<void>;
  initState: () => void;
};

export const GalleryContext = React.createContext<galleryContext>({
  galleryData: null,
  loading: true,
  error: null,
  pinnedImages: [],
  fetchGalleryData: async () => {},
  togglePinImage: async () => {},
  toggleVisibilityImage: async () => {},
  handleSaveEdit: async () => {
    return false;
  },
  handleUploadImages: async () => {
    return null;
  },
  handleDeleteImage: async () => {},
  handleShowImageOverlay: () => {},
  handleEditClick: () => {},
  loadMoreData: async () => {},
  initState: () => {},
});

export const useGalleryContext = () => React.useContext(GalleryContext);

export const GalleryContextProvider = ({ children }: any) => {
  // VARIABLES ------------------------------
  const perPage: number = 10;
  const { l } = useContext(ContextLanguage);
  const { authenticateUser } = useContext(AuthContext);
  const { toast } = useContext(ContextToast);
  const { getCollectionData, addDocument, updateDocument, deleteDocument } =
    useDataContext();

  // USE STATE -----------------------------
  const [galleryData, setGalleryData] = useState<typeImage[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const [pinnedImages, setPinnedData] = useState<typeImage[]>([]);
  const [presentAlert] = useIonAlert();

  const [presentLoading, dismissLoading] = useIonLoading();

  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayImage, setOverlayImage] = useState<typeImage | null>(null);

  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editedImage, setEditedImage] = useState<typeImage | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(2);
  // USE EFFECT ------------------------------
  // FUNCTIONS -----------------------------
  const initState = () => {
    if (authenticateUser !== undefined && galleryData === null) {
      fetchGalleryData();
      fetchPinnedImages();
    }
  };

  const handleEditClick = (image: typeImage) => {
    setEditedImage(image);
    setShowModalEdit(true);
  };

  const handleShowImageOverlay = (image: typeImage) => {
    setOverlayImage(image);
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setOverlayImage(null);
  };

  const handleDeleteImage = async (image: typeImage) => {
    presentAlert({
      header: text[l].alertDeleteTitle,
      message: text[l].alertDeleteMessage,
      buttons: [
        {
          text: text[l].alertDeleteCancel,
          role: "cancel",
        },
        {
          text: text[l].alertDeleteConfirm,
          role: "confirm",
          handler: async () => {
            await _deleteImage(image); // Call the deleteImage function here
          },
        },
      ],
    });
  };

  const _deleteImage = async (image: typeImage) => {
    presentLoading({
      message: text[l].loading,
    });
    try {
      // 2. Delete from Firestore
      const imageRef = doc(db, "gallery", image.uid);
      await deleteDoc(imageRef);

      // 3. Update local state (Important: Update state *after* successful deletion)
      setGalleryData((prevData) =>
        prevData!.filter((item) => item.uid !== image.uid)
      );
      setPinnedData((prevData) =>
        prevData.filter((item) => item.uid !== image.uid)
      );
    } catch (error) {
      console.error("Error deleting image:", error);
      toast("danger", "Error deleting image");
    }
    try {
      // 1. Delete from Storage
      const storagePath = `gallery/${image.name}`;
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);

      // 3. Update local state (Important: Update state *after* successful deletion)
      setGalleryData((prevData) =>
        prevData!.filter((item) => item.uid !== image.uid)
      );
      setPinnedData((prevData) =>
        prevData.filter((item) => item.uid !== image.uid)
      );
      toast("success", "Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast("danger", "Error deleting image");
    }
    dismissLoading();
  };

  async function handleUploadImages(
    _imagesToUpload: File[],
    _imageDetails: typeImageUploadData
  ) {
    if (!_imagesToUpload || _imagesToUpload.length === 0) {
      toast("danger", "No images selected");
      return null;
    }
    const imagesToUpload: typeImageToUpload[] = _imagesToUpload.map(
      (image, index) => ({
        file: image,
        alt: _imageDetails[index]?.alt || image.name.split(".")[0],
        description: _imageDetails[index]?.description || "",
      })
    );
    presentLoading({
      message: text[l].loading,
    });
    try {
      const uploadPromises = imagesToUpload.map(
        async (image: typeImageToUpload) => {
          const storageRef = ref(storage, `/gallery/${image.file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, image.file);

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
                const downloadURL = await getDownloadURL(
                  uploadTask.snapshot.ref
                );
                const newImage: typeImage = {
                  imageUrl: downloadURL,
                  alt: image.alt,
                  description: image.description,
                  isPinned: false,
                  name: image.file.name,
                  createdAt: Timestamp.now(),
                  uid: "",
                };

                const docRef = await addDoc(
                  collection(db, "gallery"),
                  newImage
                );
                newImage.uid = docRef.id;

                resolve(newImage); // Resolve with the image data
              }
            );
          });
        }
      );

      const uploadedImages = await Promise.all(uploadPromises);

      toast("success", "Images uploaded successfully");

      // Update local state directly after successful uploads
      setGalleryData((prevData) => [...prevData!, ...uploadedImages]);

      // Update pinned images if any new image is pinned
      const newPinnedImages = uploadedImages.filter((image) => image.isPinned);
      if (newPinnedImages.length > 0) {
        setPinnedData((prevData) => [...prevData, ...newPinnedImages]);
      }
      dismissLoading();
      return uploadedImages;
    } catch (error) {
      dismissLoading();
      console.error("Error uploading images:", error);
      return null;
    }
  }

  const fetchPinnedImages = async () => {
    try {
      const pinnedImagesRef = collection(db, "gallery");
      const q = query(pinnedImagesRef, where("isPinned", "==", true)); // Query for pinned images only
      const pinnedImagesSnapshot = await getDocs(q);

      const pinnedImagesList: typeImage[] = [];
      pinnedImagesSnapshot.docs.forEach((doc) => {
        const data = doc.data() as typeImage; // Type assertion for safety
        data.uid = doc.id;
        pinnedImagesList.push(data);
      });

      setPinnedData(pinnedImagesList);
    } catch (error) {
      console.error("Error fetching pinned images:", error);
      toast("danger", "Error loading pinned images"); // Assuming you have a toast function
    }
  };

  const fetchGalleryData = async () => {
    presentLoading({
      message: text[l].loading,
      duration: 3000,
    });
    try {
      setLoading(true);

      const galleryRef = collection(db, "gallery");
      let q = query(galleryRef, orderBy("createdAt"));

      if (currentPage > 1 && galleryData !== null && galleryData.length > 0) {
        const lastVisible = galleryData![galleryData!.length - 1];
        q = query(q, startAfter(lastVisible.createdAt));
      }

      q = query(q, limit(perPage));

      const gallerySnapshot = await getDocs(q);

      const newData = gallerySnapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      })) as typeImage[];

      const allGalleryData =
        currentPage === 1 ? newData : [...(galleryData ?? []), ...newData];
      setGalleryData(allGalleryData);

      const allPinnedImages = allGalleryData.filter((item) => item.isPinned);
      setPinnedData(allPinnedImages);
      dismissLoading();
      newData.length === 0 &&
        toast("success", "Hai scaricato tutte le immagini");
    } catch (err) {
      dismissLoading();
      setError(err);
      console.error("Error fetching gallery data:", err);
      toast("danger", "Error loading gallery data");
    } finally {
      dismissLoading();
      setLoading(false);
    }
    dismissLoading();
  };

  const togglePinImage = async (image: typeImage) => {
    try {
      const imageRef = doc(db, "gallery", image.uid);
      if (!image.isPinned) {
        // If NOT pinned already
        await updateDoc(imageRef, {
          isPinned: true,
          isVisible: true,
        });

        // Update local state after successful backend update
        setGalleryData((prevData) =>
          prevData!.map((item) =>
            item.uid === image.uid
              ? { ...item, isPinned: true, isVisible: true }
              : item
          )
        );
        setPinnedData((prevData) =>
          prevData
            ? [...prevData, { ...image, isPinned: true, isVisible: true }]
            : [{ ...image, isPinned: true, isVisible: true }]
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
          prevData!.map((item) =>
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
          prevData!.map((item) =>
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
          prevData!.map((item) =>
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
    presentLoading({
      message: text[l].loading,
    });
    try {
      const imageRef = doc(db, "gallery", editedImage.uid);
      await updateDoc(imageRef, {
        alt: editedAlt,
        description: editedDescription,
      });

      // Update local state directly
      setGalleryData((prevData) =>
        prevData!.map((item) =>
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
      dismissLoading();
      toast("success", "Image updated successfully");
      return false;
    } catch (error) {
      dismissLoading();
      console.error("Error updating image:", error);
      toast("danger", "Error updating image");
    }
    return false;
  };

  const loadMoreData = async () => {
    setCurrentPage((prevPage) => prevPage + 1);
    await fetchGalleryData();
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
        handleDeleteImage,
        handleShowImageOverlay,
        handleEditClick,
        loadMoreData,
        initState,
      }}
    >
      <>
        {children}
        {showOverlay && (
          <ImageOverlay
            showOverlay={showOverlay}
            overlayImage={overlayImage}
            closeOverlay={closeOverlay}
          />
        )}
        <ImageModalModify
          showModalEdit={showModalEdit}
          setShowModalEdit={setShowModalEdit}
          editedImage={editedImage}
          handleSaveEdit={handleSaveEdit}
        />
      </>
    </GalleryContext.Provider>
  );
};
