export interface Quote {
  id: number;
  text: string;
  category: 'social_media' | 'porn' | 'substance';
  intensity: 'mild' | 'moderate' | 'extreme';
}