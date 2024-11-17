import { Timestamp } from "firebase/firestore";

export type typeImage = {
  uid: string;
  alt: string;
  isPinned?: boolean;
  isVisible?: boolean;
  description?: string;
  createdAt: Timestamp;
  imageUrl: string;
};
