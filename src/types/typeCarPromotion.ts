import { typeFirebaseDataStructure } from "./typeFirebaseDataStructure";
import { typeImage } from "./typeImage";

export interface CarInfo {
  model?: string;
  year?: number;
  km?: number;
  price?: number | string; // Può essere un numero o una stringa come "€ 9.500 - Prezzo Promo!"
  priceHighlight?: boolean; // Opzionale: indica se il prezzo deve essere evidenziato
}

export interface CarDetails {
  shortDescription?: string;
  features?: string[]; // Lista delle caratteristiche principali
  offer?: string; // Opzionale: eventuale offerta speciale
}

export interface CarPromotion extends typeFirebaseDataStructure {
  carInfo: CarInfo;
  carDetails: CarDetails;
  images: typeImage[];
}
