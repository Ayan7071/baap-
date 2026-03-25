export type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'diamond';

export interface Hairstyle {
  id: string;
  name: string;
  image: string;
  suitability: number;
  reason: string;
  description: string;
  category?: 'trending' | 'classy' | 'long' | 'classic';
}

export interface AnalysisResult {
  faceShape: FaceShape;
  features: {
    jawline: string;
    forehead: string;
    faceLength: string;
    hairline: string;
  };
  recommendations: Hairstyle[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  favorites: string[]; // IDs of hairstyles
}
