import { typeRoute } from "../types/typeRoute";
import {
  route_GalleryPage,
  route_HomePage,
  route_ImpostazioniPage,
  route_LoginPage,
  route_PromotionsPage,
  route_RegistrazionePage,
  route_ServicesPage,
} from "./singleRoute";

export const appRoutes: typeRoute[] = [
  route_HomePage,
  route_GalleryPage,
  route_ServicesPage,
  route_PromotionsPage,
  route_ImpostazioniPage,
];

export const allRoutes = {
  route_HomePage,
  route_ImpostazioniPage,
  route_LoginPage,
  route_RegistrazionePage,
  route_PromotionsPage,
  route_ServicesPage,
  route_GalleryPage,
};

export const loginRoutes = {
  route_LoginPage,
  route_RegistrazionePage,
};
