import { typeRoute } from "../types/typeRoute";
import {
  route_HomePage,
  route_ImpostazioniPage,
  route_LoginPage,
  route_RegistrazionePage,
} from "./singleRoute";

export const appRoutes: typeRoute[] = [route_HomePage, route_ImpostazioniPage];

export const allRoutes = {
  route_HomePage,
  route_ImpostazioniPage,
  route_LoginPage,
  route_RegistrazionePage,
};

export const loginRoutes = {
  route_LoginPage,
  route_RegistrazionePage,
};
