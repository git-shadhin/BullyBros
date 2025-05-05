import { Goal } from './goal';

export type Addiction = 'social_media' | 'porn' | 'substance';
export type PremiumLevel = 'none' | 'basic' | 'pro' | 'ultimate';
export type IntensityLevel = 'mild' | 'moderate' | 'extreme';

export interface UserData {
  isLoggedIn: boolean;
  isOnboarded: boolean;
  username?: string;
  addictions: Addiction[];
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  premium: PremiumLevel;
  intensity: IntensityLevel;
  stopBullying?: boolean;
  stats?: {
    tiktok_minutes: number;
    porn_sessions: number;
    cigarettes: number;
  };
  goals?: Goal[];
}

export const DEFAULT_USER_DATA: UserData = {
  isLoggedIn: false,
  isOnboarded: false,
  addictions: [],
  theme: 'light',
  notifications: true,
  premium: 'none',
  intensity: 'extreme',
  stats: {
    tiktok_minutes: 120,
    porn_sessions: 3,
    cigarettes: 5,
  },
  goals: [
    {
      type: 'social_media',
      target: 30,
      current: 45
    }
  ]
};