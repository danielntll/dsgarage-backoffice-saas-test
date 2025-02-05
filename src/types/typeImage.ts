import { Timestamp } from "firebase/firestore";
import { typeFirebaseDataStructure } from "./typeFirebaseDataStructure";

export interface typeImage extends typeFirebaseDataStructure {
  uid: string;
  alt: string;
  description?: string;
  createdAt: Timestamp;
  imageUrl: string;
  name: string;
}
