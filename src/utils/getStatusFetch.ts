import { textDataManaging } from "../text/textDataManaging";
import { typeAvailableLanguages } from "../types/typeAvailableLanguage";
import { typeContextStatus } from "../types/typeContextStatus";

export const getStatusFetch = (
  status: "loading" | "error" | "success",
  type: "fetch" | "upload" | "update",
  language: typeAvailableLanguages,
  message?: string
): typeContextStatus => {
  return {
    status: status,
    message: textDataManaging[language][status][type] + " " + message || "",
  };
};
