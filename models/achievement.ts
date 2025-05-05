export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  type: 'social_media' | 'porn' | 'substance' | 'general';
  requiresPremium: boolean;
}