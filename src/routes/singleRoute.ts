import {
  home,
  homeOutline,
  images,
  imagesOutline,
  logIn,
  logInOutline,
  personAdd,
  personAddOutline,
  pricetags,
  pricetagsOutline,
  settings,
  settingsOutline,
  storefront,
  storefrontOutline,
} from "ionicons/icons";
import { typeRoute } from "../types/typeRoute";

// APP --------------
export const route_ServicesPage: typeRoute = {
  path: "/servizi",
  tab: {
    it_IT: "Servizi",
    en_GB: "Services",
  },
  icons: {
    active: storefront,
    notActive: storefrontOutline,
  },
};
export const route_PromotionsPage: typeRoute = {
  path: "/promozioni",
  tab: {
    it_IT: "Promozioni",
    en_GB: "Promotions",
  },
  icons: {
    active: pricetags,
    notActive: pricetagsOutline,
  },
};
export const route_GalleryPage: typeRoute = {
  path: "/galleria",
  tab: {
    it_IT: "Galleria",
    en_GB: "Galleria",
  },
  icons: {
    active: images,
    notActive: imagesOutline,
  },
};
export const route_HomePage: typeRoute = {
  path: "/home",
  tab: {
    it_IT: "Home",
    en_GB: "Home",
  },
  icons: {
    active: home,
    notActive: homeOutline,
  },
};
export const route_ImpostazioniPage: typeRoute = {
  path: "/impostazioni",
  tab: {
    it_IT: "Impostazioni",
    en_GB: "Settings",
  },
  icons: {
    active: settings,
    notActive: settingsOutline,
  },
};

// AUTH -----------------
// Login
export const route_LoginPage: typeRoute = {
  path: "/login",
  tab: {
    it_IT: "Accesso",
    en_GB: "Login",
  },
  icons: {
    active: logIn,
    notActive: logInOutline,
  },
};
// Registrazione
export const route_RegistrazionePage: typeRoute = {
  path: "/registrazione",
  tab: {
    it_IT: "Register",
    en_GB: "Registrazione",
  },
  icons: {
    active: personAdd,
    notActive: personAddOutline,
  },
};
