export type FlashcardContent = {
    id: string; 
    front: string;
    back: string;
  };
  export interface User {
    id: string;
    name: string;
    email: string;
    password: string; // Or other authentication method
    createdAt: Date;
    updatedAt: Date;
  }
  export interface Category {
    id: string;
    name: string;
  }
  
  export interface FlashcardData {
    id: string;
    front: string;
    back: string;
    flashcardCollectionId: string;
  }
  

export interface FlashcardCollection {
    id: string;
    userId: string;
    name: string;
    slug: string;
    headline: string;
    description: string;
    categories: string[]; // Assuming categories are strings
    flashcards: FlashcardData[];
    createdAt: Date;
    updatedAt: Date;
  }
  