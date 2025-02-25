import { Timestamp } from "firebase/firestore";
import { typeFirebaseDataStructure } from "./typeFirebaseDataStructure";

export interface typePromotion extends typeFirebaseDataStructure {
  target: string;
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  category: string;
  description: string;
  startAt: Timestamp;
  endAt: Timestamp;
}
