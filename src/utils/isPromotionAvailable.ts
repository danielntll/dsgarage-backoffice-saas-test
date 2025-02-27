import { Timestamp } from "firebase/firestore";
import { typePromotion } from "../types/typePromotion";

export function isPromotionAvailable(
  data: typePromotion
): "expired" | "inProgress" | "notStarted" {
  const today = new Date();
  const startDate = (data.startAt as Timestamp).toDate();
  const endDate = (data.endAt as Timestamp).toDate();
  if (today < startDate) {
    return "notStarted";
  }
  if (today > endDate) {
    return "expired";
  }
  if (today >= startDate && today <= endDate) {
    return "inProgress";
  }
  return "notStarted";
}

export function isPromotionInProgress(data: typePromotion): boolean {
  try {
    const today = new Date();
    const startDate = (data.startAt as Timestamp).toDate();
    const endDate = (data.endAt as Timestamp).toDate();
    return today >= startDate && today <= endDate;
  } catch (error) {
    console.error("Error checking promotion status:", error);
    return false; // Return false on error to avoid unexpected behavior
  }
}

export function isPromotionExpired(data: typePromotion): boolean {
  try {
    const today = new Date();
    const endDate = (data.endAt as Timestamp).toDate();
    return today > endDate;
  } catch (error) {
    console.error("Error checking promotion status:", error);
    return false; //Return false on error
  }
}

export function isPromotionNotStarted(data: typePromotion): boolean {
  try {
    const today = new Date();
    const startDate = (data.startAt as Timestamp).toDate();
    return today < startDate;
  } catch (error) {
    console.error("Error checking promotion status:", error);
    return false; // Return false on error
  }
}
