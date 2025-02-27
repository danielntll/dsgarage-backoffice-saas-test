import { typePromotion } from "./typePromotion";

export type typePromotionModal = {
  isOpen: boolean;
  mode: typeModePromotionModal;
  promotion?: typePromotion;
};
export type typeModePromotionModal = "create" | "update";
