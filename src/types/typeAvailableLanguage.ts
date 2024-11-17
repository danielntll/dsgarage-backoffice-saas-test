import { typeMapKeysToAny } from "./typeMapKeysToAny";

export type typeAvailableLanguages = "it_IT" | "en_GB";

export type typeAvailableLanguagesModel = {
  it_IT: any;
  en_GB: any;
};

export type typeAvailableLanguagesMapped =
  typeMapKeysToAny<typeAvailableLanguagesModel>;
