import { typeFirebaseDataStructure } from "./typeFirebaseDataStructure";

export interface typeImage extends typeFirebaseDataStructure {
  alt: string;
  description?: string;
  imageUrl: string;
  name: string;
  isGallery: boolean;
}
