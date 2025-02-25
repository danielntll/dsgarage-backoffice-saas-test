import { typeFirebaseDataStructure } from "./typeFirebaseDataStructure";
import { typeImageSimple } from "./typeImageSimple";

export interface typeService extends typeFirebaseDataStructure {
  image: typeImageSimple;
  title: string;
  subtitle: string;
  description: string;
}
