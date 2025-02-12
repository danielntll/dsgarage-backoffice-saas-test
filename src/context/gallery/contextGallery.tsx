import React, { useCallback, useContext, useState } from "react";
import { ContextLanguage } from "../contextLanguage";
import { AuthContext } from "../contextAuth";
import { ContextToast } from "../systemEvents/contextToast";
import { typeImage } from "../../types/typeImage";
import { useIonAlert, useIonLoading } from "@ionic/react";
import { text } from "./text";
import ImageOverlay from "../../components/Image__Overlay/ImageOverlay";
import ImageModalModify from "../../components/Image__Modal__Modify/ImageModalModify";
import { useDataContext } from "../contextData";
import { typeContextStatus } from "../../types/typeContextStatus";
import { getStatusFetch } from "../../utils/getStatusFetch";
import { typeFirebaseDataStructure } from "../../types/typeFirebaseDataStructure";
import { typeImageUploadData } from "../../types/typeImageUploadData";

type galleryContext = {
  galleryData: typeImage[];
  initData: () => void;
  addData: (
    imagesToUpload: File[],
    imageDetails: typeImageUploadData
  ) => Promise<void>;
  statusFetch: typeContextStatus | null;
  statusUpload: typeContextStatus | null;
  statusUpdate: typeContextStatus | null;
  statusDelete: typeContextStatus | null;
};

export const GalleryContext = React.createContext<galleryContext>({
  galleryData: [],
  initData: () => {},
  addData: async () => Promise.resolve(),
  statusFetch: { status: "loading", message: "" },
  statusUpload: { status: "success", message: "" },
  statusUpdate: { status: "success", message: "" },
  statusDelete: { status: "success", message: "" },
});

export const useGalleryContext = () => React.useContext(GalleryContext);

export const GalleryContextProvider = ({ children }: any) => {
  // VARIABLES ------------------------------
  const DOC_PATH = "gallery";
  const perPage: number = 10;
  const { l } = useContext(ContextLanguage);
  const { authenticateUser } = useContext(AuthContext);
  const {
    getCollectionData,
    addDocument,
    updateDocument,
    deleteDocument,
    uploadFile,
  } = useDataContext();
  const { toast } = useContext(ContextToast);
  const [presentAlert] = useIonAlert();
  const [presentLoading, dismissLoading] = useIonLoading();

  // USE STATE -----------------------------
  const [galleryData, setGalleryData] = useState<typeImage[]>([]);
  const [statusFetch, setStatusFetch] = useState<typeContextStatus | null>(
    getStatusFetch("loading", "fetch", l)
  );
  const [statusUpload, setStatusUpload] = useState<typeContextStatus | null>(
    getStatusFetch("success", "upload", l)
  );
  const [statusUpdate, setStatusUpdate] = useState<typeContextStatus | null>(
    getStatusFetch("success", "update", l)
  );
  const [statusDelete, setStatusDelete] = useState<typeContextStatus | null>(
    getStatusFetch("success", "delete", l)
  );

  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayImage, setOverlayImage] = useState<typeImage | null>(null);

  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editedImage, setEditedImage] = useState<typeImage | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(2);
  // USE EFFECT ------------------------------
  // FUNCTIONS -----------------------------
  // ---  initData
  /**
   *
   */
  const initData = useCallback(async () => {
    if (authenticateUser !== null) {
      setStatusFetch(getStatusFetch("loading", "fetch", l));
      try {
        const data: typeImage[] | null = await getCollectionData<typeImage>(
          DOC_PATH
        );
        if (data !== null) {
          setGalleryData(data);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setStatusFetch(getStatusFetch("error", "fetch", l));
      } finally {
        setStatusFetch(getStatusFetch("success", "fetch", l));
      }
    } else {
      setStatusFetch(
        getStatusFetch("error", "fetch", l, "Utente non autenticato.")
      );
    }
  }, [authenticateUser]);

  /**
   *
   */
  const addData = useCallback(
    async (imagesToUpload: File[], imageDetails: typeImageUploadData) => {
      setStatusUpload(getStatusFetch("loading", "upload", l));

      try {
        const uploadPromises = imagesToUpload.map(async (file, index) => {
          const filePath = `/gallery/${file.name}`; // Define the storage path
          const downloadURL = await uploadFile(filePath, file);

          if (downloadURL) {
            const newImage: typeImage = {
              imageUrl: downloadURL,
              alt: imageDetails[index]?.alt || file.name.split(".")[0],
              description: imageDetails[index]?.description || "",
              name: file.name,
            };
            return newImage;
          } else {
            // Handle upload error, maybe reject the promise or throw an error
            console.error("Error uploading image:", file.name);
            toast("danger", `Error uploading ${file.name}`);
            return null;
          }
        });

        const uploadedImages = (await Promise.all(uploadPromises)).filter(
          (image) => image !== null
        ) as typeImage[]; // Filter out any null results from upload errors

        if (uploadedImages.length > 0) {
          const addFirestorePromises = uploadedImages.map(async (image) => {
            try {
              const doc: (typeImage & typeFirebaseDataStructure) | undefined =
                await addDocument<typeImage>(DOC_PATH, image);
              if (doc !== undefined) {
                return doc; // Return the successfully added document
              } else {
                // Handle firestore add error
                console.error("Error adding image to Firestore:", image.name);
                toast("danger", `Error adding ${image.name} to Firestore`);
                return null; // Or throw an error to stop the process if desired
              }
            } catch (error) {
              console.error("Error in addDocument:", error);
              return null; // Or throw the error
            }
          });

          const firestoreResults = await Promise.all(addFirestorePromises);
          const successfullyAddedImages = firestoreResults.filter(
            (result) => result !== null
          ) as (typeImage & typeFirebaseDataStructure)[]; //Filter null results

          setGalleryData((prev) => [...prev, ...successfullyAddedImages]);
          setStatusUpload(getStatusFetch("success", "upload", l));
          toast("success", "Images uploaded successfully");
        } else {
          // Handle the case where no images were uploaded successfully.
          setStatusUpload(getStatusFetch("error", "upload", l));
          toast("danger", "No images uploaded successfully.");
        }
      } catch (error) {
        console.error("Error uploading images:", error);
        setStatusUpload(getStatusFetch("error", "upload", l));
        toast("danger", "Error uploading images");
      }
    },
    []
  );

  // const initState = () => {
  //   if (authenticateUser !== undefined && galleryData === null) {
  //     fetchGalleryData();
  //     fetchPinnedImages();
  //   }
  // };

  // const handleEditClick = (image: typeImage) => {
  //   setEditedImage(image);
  //   setShowModalEdit(true);
  // };

  // const handleShowImageOverlay = (image: typeImage) => {
  //   setOverlayImage(image);
  //   setShowOverlay(true);
  // };

  // const closeOverlay = () => {
  //   setShowOverlay(false);
  //   setOverlayImage(null);
  // };

  // const handleDeleteImage = async (image: typeImage) => {
  //   presentAlert({
  //     header: text[l].alertDeleteTitle,
  //     message: text[l].alertDeleteMessage,
  //     buttons: [
  //       {
  //         text: text[l].alertDeleteCancel,
  //         role: "cancel",
  //       },
  //       {
  //         text: text[l].alertDeleteConfirm,
  //         role: "confirm",
  //         handler: async () => {
  //           await _deleteImage(image); // Call the deleteImage function here
  //         },
  //       },
  //     ],
  //   });
  // };

  // const _deleteImage = async (image: typeImage) => {
  //   presentLoading({
  //     message: text[l].loading,
  //   });
  //   try {
  //     // 2. Delete from Firestore
  //     const imageRef = doc(db, "gallery", image.uid);
  //     await deleteDoc(imageRef);

  //     // 3. Update local state (Important: Update state *after* successful deletion)
  //     setGalleryData((prevData) =>
  //       prevData!.filter((item) => item.uid !== image.uid)
  //     );
  //   } catch (error) {
  //     console.error("Error deleting image:", error);
  //     toast("danger", "Error deleting image");
  //   }
  //   try {
  //     // 1. Delete from Storage
  //     const storagePath = `gallery/${image.name}`;
  //     const storageRef = ref(storage, storagePath);
  //     await deleteObject(storageRef);

  //     // 3. Update local state (Important: Update state *after* successful deletion)
  //     setGalleryData((prevData) =>
  //       prevData!.filter((item) => item.uid !== image.uid)
  //     );
  //     toast("success", "Image deleted successfully");
  //   } catch (error) {
  //     console.error("Error deleting image:", error);
  //     toast("danger", "Error deleting image");
  //   }
  //   dismissLoading();
  // };

  // async function handleUploadImages(
  //   _imagesToUpload: File[],
  //   _imageDetails: typeImageUploadData
  // ) {
  //   if (!_imagesToUpload || _imagesToUpload.length === 0) {
  //     toast("danger", "No images selected");
  //     return null;
  //   }
  //   const imagesToUpload: typeImageToUpload[] = _imagesToUpload.map(
  //     (image, index) => ({
  //       file: image,
  //       alt: _imageDetails[index]?.alt || image.name.split(".")[0],
  //       description: _imageDetails[index]?.description || "",
  //     })
  //   );
  //   presentLoading({
  //     message: text[l].loading,
  //   });
  //   try {
  //     const uploadPromises = imagesToUpload.map(
  //       async (image: typeImageToUpload) => {
  //         const storageRef = ref(storage, `/gallery/${image.file.name}`);
  //         const uploadTask = uploadBytesResumable(storageRef, image.file);

  //         return new Promise<typeImage>((resolve, reject) => {
  //           uploadTask.on(
  //             "state_changed",
  //             (snapshot) => {},
  //             (error) => {
  //               console.error("Upload failed:", error);
  //               toast("danger", "Upload failed");
  //               reject(error); // Reject the promise if upload fails
  //             },
  //             async () => {
  //               const downloadURL = await getDownloadURL(
  //                 uploadTask.snapshot.ref
  //               );
  //               const newImage: typeImage = {
  //                 imageUrl: downloadURL,
  //                 alt: image.alt,
  //                 description: image.description,
  //                 isPinned: false,
  //                 name: image.file.name,
  //                 createdAt: Timestamp.now(),
  //                 uid: "",
  //               };

  //               const docRef = await addDoc(
  //                 collection(db, "gallery"),
  //                 newImage
  //               );
  //               newImage.uid = docRef.id;

  //               resolve(newImage); // Resolve with the image data
  //             }
  //           );
  //         });
  //       }
  //     );

  //     const uploadedImages = await Promise.all(uploadPromises);

  //     toast("success", "Images uploaded successfully");

  //     // Update local state directly after successful uploads
  //     setGalleryData((prevData) => [...prevData!, ...uploadedImages]);

  //     // Update pinned images if any new image is pinned
  //     const newPinnedImages = uploadedImages.filter((image) => image.isPinned);
  //     if (newPinnedImages.length > 0) {
  //       setPinnedData((prevData) => [...prevData, ...newPinnedImages]);
  //     }
  //     dismissLoading();
  //     return uploadedImages;
  //   } catch (error) {
  //     dismissLoading();
  //     console.error("Error uploading images:", error);
  //     return null;
  //   }
  // }

  // const fetchPinnedImages = async () => {
  //   try {
  //     const pinnedImagesRef = collection(db, "gallery");
  //     const q = query(pinnedImagesRef, where("isPinned", "==", true)); // Query for pinned images only
  //     const pinnedImagesSnapshot = await getDocs(q);

  //     const pinnedImagesList: typeImage[] = [];
  //     pinnedImagesSnapshot.docs.forEach((doc) => {
  //       const data = doc.data() as typeImage; // Type assertion for safety
  //       data.uid = doc.id;
  //       pinnedImagesList.push(data);
  //     });

  //     setPinnedData(pinnedImagesList);
  //   } catch (error) {
  //     console.error("Error fetching pinned images:", error);
  //     toast("danger", "Error loading pinned images"); // Assuming you have a toast function
  //   }
  // };

  // const fetchGalleryData = async () => {
  //   presentLoading({
  //     message: text[l].loading,
  //     duration: 3000,
  //   });
  //   try {
  //     setLoading(true);

  //     const galleryRef = collection(db, "gallery");
  //     let q = query(galleryRef, orderBy("createdAt"));

  //     if (currentPage > 1 && galleryData !== null && galleryData.length > 0) {
  //       const lastVisible = galleryData![galleryData!.length - 1];
  //       q = query(q, startAfter(lastVisible.createdAt));
  //     }

  //     q = query(q, limit(perPage));

  //     const gallerySnapshot = await getDocs(q);

  //     const newData = gallerySnapshot.docs.map((doc) => ({
  //       ...doc.data(),
  //       uid: doc.id,
  //     })) as typeImage[];

  //     const allGalleryData =
  //       currentPage === 1 ? newData : [...(galleryData ?? []), ...newData];
  //     setGalleryData(allGalleryData);

  //     const allPinnedImages = allGalleryData.filter((item) => item.isPinned);
  //     setPinnedData(allPinnedImages);
  //     dismissLoading();
  //     newData.length === 0 &&
  //       toast("success", "Hai scaricato tutte le immagini");
  //   } catch (err) {
  //     dismissLoading();
  //     setError(err);
  //     console.error("Error fetching gallery data:", err);
  //     toast("danger", "Error loading gallery data");
  //   } finally {
  //     dismissLoading();
  //     setLoading(false);
  //   }
  //   dismissLoading();
  // };

  // const togglePinImage = async (image: typeImage) => {
  //   try {
  //     const imageRef = doc(db, "gallery", image.uid);
  //     if (!image.isPinned) {
  //       // If NOT pinned already
  //       await updateDoc(imageRef, {
  //         isPinned: true,
  //         isVisible: true,
  //       });

  //       // Update local state after successful backend update
  //       setGalleryData((prevData) =>
  //         prevData!.map((item) =>
  //           item.uid === image.uid
  //             ? { ...item, isPinned: true, isVisible: true }
  //             : item
  //         )
  //       );
  //       setPinnedData((prevData) =>
  //         prevData
  //           ? [...prevData, { ...image, isPinned: true, isVisible: true }]
  //           : [{ ...image, isPinned: true, isVisible: true }]
  //       );
  //       toast("success", "Immagine aggiunta");
  //     } else {
  //       // If already pinned
  //       await updateDoc(imageRef, {
  //         isPinned: false,
  //       });

  //       // Update local state: remove from pinnedImages, update isPinned in galleryData
  //       setPinnedData((prevData) =>
  //         prevData.filter((item) => item.uid !== image.uid)
  //       );
  //       setGalleryData((prevData) =>
  //         prevData!.map((item) =>
  //           item.uid === image.uid ? { ...item, isPinned: false } : item
  //         )
  //       );
  //       toast("success", "Immagine rimossa");
  //     }
  //   } catch (error) {
  //     console.error("Error pinning image:", error);
  //     toast("danger", "Error pinning image");
  //   }
  // };

  // const toggleVisibilityAndCheckPinned = async (image: typeImage) => {
  //   try {
  //     const imageRef = doc(db, "gallery", image.uid);
  //     if (!image.isVisible) {
  //       // If NOT pinned already
  //       await updateDoc(imageRef, {
  //         isVisible: true,
  //       });
  //       // Update local state after successful backend update
  //       setGalleryData((prevData) =>
  //         prevData!.map((item) =>
  //           item.uid === image.uid ? { ...item, isVisible: true } : item
  //         )
  //       );
  //       toast("success", "Immagine visibile nella galleria");
  //     } else {
  //       // If already pinned
  //       await updateDoc(imageRef, {
  //         isVisible: false,
  //       });
  //       // Update local state after successful backend update
  //       setGalleryData((prevData) =>
  //         prevData!.map((item) =>
  //           item.uid === image.uid ? { ...item, isVisible: false } : item
  //         )
  //       );
  //       toast("success", "Immagine nascosta");
  //     }
  //   } catch (error) {
  //     console.error("Error pinning image:", error);
  //     toast("danger", "Error pinning image");
  //   }
  // };

  // const toggleVisibilityImage = async (image: typeImage) => {
  //   if (image.isPinned && image.isVisible) {
  //     presentAlert({
  //       header: "Attenzione",
  //       subHeader: "Immagine in evidenza",
  //       message:
  //         "Questa immagine risulta nella lista delle immagini in evidenza, nascondere l'immagine comporta la rimozione dalla lista delle immagini in evidenza",
  //       buttons: [
  //         {
  //           text: "Annulla",
  //           role: "cancel",
  //           handler: () => {
  //             console.log("Alert canceled");
  //           },
  //         },
  //         {
  //           text: "OK",
  //           role: "confirm",
  //           handler: () => {
  //             toggleVisibilityAndCheckPinned(image);
  //             togglePinImage(image);
  //           },
  //         },
  //       ],
  //     });
  //   } else {
  //     toggleVisibilityAndCheckPinned(image);
  //   }
  // };

  // const handleSaveEdit = async (
  //   editedImage: typeImage,
  //   editedAlt: string,
  //   editedDescription: string
  // ): Promise<boolean> => {
  //   if (!editedImage) return false;
  //   presentLoading({
  //     message: text[l].loading,
  //   });
  //   try {
  //     const imageRef = doc(db, "gallery", editedImage.uid);
  //     await updateDoc(imageRef, {
  //       alt: editedAlt,
  //       description: editedDescription,
  //     });

  //     // Update local state directly
  //     setGalleryData((prevData) =>
  //       prevData!.map((item) =>
  //         item.uid === editedImage.uid
  //           ? { ...item, alt: editedAlt, description: editedDescription }
  //           : item
  //       )
  //     );

  //     // Update pinnedImages if necessary
  //     if (editedImage.isPinned) {
  //       setPinnedData((prevData) =>
  //         prevData.map((item) =>
  //           item.uid === editedImage.uid
  //             ? { ...item, alt: editedAlt, description: editedDescription }
  //             : item
  //         )
  //       );
  //     }
  //     dismissLoading();
  //     toast("success", "Image updated successfully");
  //     return false;
  //   } catch (error) {
  //     dismissLoading();
  //     console.error("Error updating image:", error);
  //     toast("danger", "Error updating image");
  //   }
  //   return false;
  // };

  // const loadMoreData = async () => {
  //   setCurrentPage((prevPage) => prevPage + 1);
  //   await fetchGalleryData();
  // };

  // RETURN ---------------------------------
  return (
    <GalleryContext.Provider
      value={{
        galleryData,
        statusFetch,
        statusUpload,
        statusUpdate,
        statusDelete,
        addData,
        initData,
      }}
    >
      {/* <>
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
      </> */}
    </GalleryContext.Provider>
  );
};
