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
    name: string;
    slug: string;
    headline: string;
    description: string;
    categories: Category[]; // List of categories associated with the collection
    userId: string;
    flashcards: FlashcardData[];
    createdAt: Date;
    updatedAt: Date;
  }
  