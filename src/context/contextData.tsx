import React from "react";
import { useAuthContext } from "./contextAuth";
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  getDocs,
  limit,
  query,
  QuerySnapshot,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "../firebase/firebaseConfig";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { typeFirebaseDataStructure } from "../types/typeFirebaseDataStructure";

type dataContext = {
  getCollectionData: <T>(collectionPath: string) => Promise<T[] | null>;
  getPaginationCollectionData: <T>(
    collectionPath: string,
    perPage: number,
    startAfterDoc?: DocumentSnapshot<DocumentData>,
    whereClause?: [string, "==", any]
  ) => Promise<{
    data: T[];
    lastVisible?: DocumentSnapshot<DocumentData>;
  } | null>;
  addDocument: <T>(
    collectionPath: string,
    data: T
  ) => Promise<(T & typeFirebaseDataStructure) | undefined>;
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
    return null;
  },
  getPaginationCollectionData: async () => {
    return null;
  },
  addDocument: async () => Promise.resolve(undefined),
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
  console.log("TEST- TEST");
  // FUNCTIONS ------------------------------
  // ---  getCollectionData
  async function getCollectionData<T>(
    collectionPath: string
  ): Promise<T[] | null> {
    console.log("getCollectionData=", collectionPath);
    try {
      const dataCollection: CollectionReference<DocumentData, DocumentData> =
        collection(db, collectionPath);
      const dataSnapshot: QuerySnapshot<DocumentData, DocumentData> =
        await getDocs(dataCollection);

      const data: T[] = [];
      dataSnapshot.forEach((doc) => {
        data.push({ ...doc.data(), uid: doc.id } as T);
      });
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error getting collection data:", error);
      return null;
    }
  }
  // ---  getPaginationCollectionData
  async function getPaginationCollectionData<T>(
    collectionPath: string,
    perPage: number = 10,
    startAfterDoc?: DocumentSnapshot<DocumentData>,
    whereClause?: [string, "==", any]
  ): Promise<{
    data: T[];
    lastVisible?: DocumentSnapshot<DocumentData>;
  } | null> {
    console.log("getCollectionData=", collectionPath);
    try {
      let q = query(collection(db, collectionPath));

      if (whereClause) {
        // Apply where clause if provided
        q = query(q, where(whereClause[0], whereClause[1], whereClause[2]));
      }

      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      q = query(q, limit(perPage));

      const dataSnapshot = await getDocs(q);

      const data: T[] = [];
      dataSnapshot.forEach((doc) => {
        data.push({ ...doc.data(), uid: doc.id } as T);
      });

      const lastVisible =
        dataSnapshot.docs.length > 0
          ? dataSnapshot.docs[dataSnapshot.docs.length - 1]
          : undefined;

      return { data, lastVisible };
    } catch (error) {
      console.error("Error getting collection data:", error);
      return null;
    }
  }

  // ---  addDocument
  async function addDocument<T>(
    collectionPath: string,
    data: T
  ): Promise<(T & typeFirebaseDataStructure) | undefined> {
    console.log("addDocument=", collectionPath);
    try {
      const dataCollection: CollectionReference<DocumentData, DocumentData> =
        collection(db, collectionPath);

      const fbDataStructure: typeFirebaseDataStructure = {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        byUserUID: authenticateUser!.uid,
        isArchived: false,
        isPinned: false,
      };

      const docRef: DocumentReference<DocumentData, DocumentData> =
        await addDoc(dataCollection, {
          ...data,
          ...fbDataStructure,
        });
      const fullData: T & typeFirebaseDataStructure = {
        ...data,
        ...fbDataStructure,
        uid: docRef.id,
      };
      return fullData;
    } catch (error) {
      console.error("Error adding document:", error);
      return undefined;
    }
  }
  // ---  updateDocument
  async function updateDocument<T>(
    collectionPath: string,
    documentId: string,
    data: Partial<T>
  ): Promise<void> {
    console.log("updateDocument=", collectionPath);
    try {
      const documentRef: DocumentReference<DocumentData, DocumentData> = doc(
        db,
        collectionPath,
        documentId
      );
      const fbDataStructure: typeFirebaseDataStructure = {
        updatedAt: serverTimestamp(),
        byUserUID: authenticateUser!.uid,
      };

      await updateDoc(documentRef, {
        ...data,
        fbDataStructure,
      });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  }
  // ---  deleteDocument
  async function deleteDocument(
    collectionPath: string,
    documentId: string
  ): Promise<void> {
    console.log("deleteDocument=", collectionPath);
    try {
      const documentRef: DocumentReference<DocumentData, DocumentData> = doc(
        db,
        collectionPath,
        documentId
      );
      await deleteDoc(documentRef);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  }
  // ---  uploadFile
  async function uploadFile(
    filePath: string,
    file: File
  ): Promise<string | null> {
    console.log("uploadFile=", filePath);
    try {
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
  // ---  deleteFile
  async function deleteFile(filePath: string): Promise<void> {
    console.log("deleteFile=", filePath);
    try {
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
        getPaginationCollectionData,
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
