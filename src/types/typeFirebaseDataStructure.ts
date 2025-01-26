import { FieldValue, Timestamp } from "firebase/firestore";

export interface typeFirebaseDataStructure {
  uid?: string; // Ci penserà Firebase ad assegnarlo
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  byUserUID: string;
  isArchived: boolean; // Se nascosto o meno: serve come filtro
  isPinned: boolean; // Se in evidenza: serve come filtro
}
