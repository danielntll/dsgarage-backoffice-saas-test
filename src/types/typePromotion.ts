import { Timestamp } from "firebase/firestore";
import { typeFirebaseDataStructure } from "./typeFirebaseDataStructure";
import { typeTarget } from "./typeTarget";

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

export interface typePromotionForFrontend extends typeFirebaseDataStructure {
  target: typeTarget;
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  category: string;
  description: string;
  startAt: Timestamp;
  endAt: Timestamp;
}
