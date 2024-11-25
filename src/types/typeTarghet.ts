import { Timestamp } from "firebase/firestore";

export type typePromotion = {
  uid: string;
  target: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  category: string;
  description: string;
  isVisible: boolean;
  isPinned: boolean;
  startAt: Timestamp;
  endAt: Timestamp;
  createdAt: Timestamp;
};
