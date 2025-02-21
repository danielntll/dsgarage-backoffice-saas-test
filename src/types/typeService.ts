import { typeFirebaseDataStructure } from "./typeFirebaseDataStructure";

export interface typeService extends typeFirebaseDataStructure {
  imageUrl: string;
  title: string;
  subtitle: string;
  description: string;
}
