import React from "react";
import { useAuthContext } from "./contextAuth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

type dataContext = {
  getCollectionData: <T>(collectionPath: string) => Promise<T[]>;
  addDocument: <T>(collectionPath: string, data: T) => Promise<void>;
  updateDocument: <T>(
    collectionPath: string,
    documentId: string,
    data: Partial<T>
  ) => Promise<void>;
  deleteDocument: (collectionPath: string, documentId: string) => Promise<void>;
  uploadFile: (filePath: string, file: File) => Promise<string | null>;
  deleteFile: (filePath: string) => Promise<void>;
};

export const DataContext = React.createContext<dataContext>({
  getCollectionData: async () => {
    return [];
  },
  addDocument: async () => Promise.resolve(),
  updateDocument: async () => Promise.resolve(),
  deleteDocument: async () => Promise.resolve(),
  uploadFile: async () => null,
  deleteFile: async () => Promise.resolve(),
});

export const useDataContext = () => React.useContext(DataContext);

export const DataContextProvider = ({ children }: any) => {
  // VARIABLES ------------------------------
  const { authenticateUser } = useAuthContext();
  // USE STATE -----------------------------
  // USE EFFECT ------------------------------
  // FUNCTIONS ------------------------------
  async function getCollectionData<T>(collectionPath: string): Promise<T[]> {
    try {
      console.log("getCollectionData : ", collectionPath);
      const dataCollection = collection(db, collectionPath);
      const dataSnapshot = await getDocs(dataCollection);

      const data: T[] = [];
      dataSnapshot.forEach((doc) => {
        data.push(doc.data() as T);
      });

      return data;
    } catch (error) {
      console.error("Error getting collection data:", error);
      return [];
    }
  }

  async function addDocument<T>(
    collectionPath: string,
    data: T
  ): Promise<void> {
    try {
      const dataCollection = collection(db, collectionPath);
      await addDoc(dataCollection, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        byUID: authenticateUser?.uid,
      });
    } catch (error) {
      console.error("Error adding document:", error);
    }
  }

  async function updateDocument<T>(
    collectionPath: string,
    documentId: string,
    data: Partial<T>
  ): Promise<void> {
    try {
      const documentRef = doc(db, collectionPath, documentId);

      await updateDoc(documentRef, {
        ...data,
        updatedAt: serverTimestamp(), // Update the timestamp
      });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }

  async function deleteDocument(
    collectionPath: string,
    documentId: string
  ): Promise<void> {
    try {
      const documentRef = doc(db, collectionPath, documentId);
      await deleteDoc(documentRef);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  }

  async function uploadFile(
    filePath: string,
    file: File
  ): Promise<string | null> {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                console.log("Upload default case");
            }
          },
          (error) => {
            console.error("Error uploading file:", error);
            reject(error);
            return null;
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);
              resolve(downloadURL);
            });
          }
        );
      });
    } catch (error) {
      console.error("Error in uploadFile:", error);
      return null;
    }
  }

  async function deleteFile(filePath: string): Promise<void> {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, filePath); // Create a reference to the file

      await deleteObject(storageRef);
      console.log("File deleted successfully:", filePath);
    } catch (error) {
      console.error("Error deleting file:", filePath, error);
    }
  }

  // RETURN ---------------------------------
  return (
    <DataContext.Provider
      value={{
        getCollectionData,
        addDocument,
        updateDocument,
        deleteDocument,
        uploadFile,
        deleteFile,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
