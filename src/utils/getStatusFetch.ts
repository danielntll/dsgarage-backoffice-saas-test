import { textDataManaging } from "../text/textDataManaging";
import { typeAvailableLanguages } from "../types/typeAvailableLanguage";
import { typeContextStatus } from "../types/typeContextStatus";

export const getStatusFetch = (
  status: "notInitializzed" | "loading" | "error" | "success",
  type: "fetch" | "upload" | "update" | "delete",
  language: typeAvailableLanguages,
  message?: string
): typeContextStatus => {
  return {
    status: status,
    message: textDataManaging[language][status][type] + " " + message || "",
  };
};
