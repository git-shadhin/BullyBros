import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { UserData, DEFAULT_USER_DATA, Addiction, PremiumLevel } from '@/models/user';
import { Goal } from '@/models/goal';
import { storeUserData, retrieveUserData } from '@/services/storageService';
import { registerForPushNotifications, schedulePushNotification } from '@/services/notificationService';

interface UserContextType {
  userData: UserData | null;
  isLoggedIn: boolean;
  isOnboarded: boolean;
  login: (username: string, rememberMe: boolean) => void;
  logout: () => void;
  completeOnboarding: (addictions: Addiction[]) => void;
  upgradePremium: (level: PremiumLevel) => void;
  updateSettings: (settings: Partial<UserData>) => void;
  loadUserData: () => Promise<void>;
  updateGoal: (index: number, goal: Goal) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await retrieveUserData();
      if (data) {
        console.log('Retrieved user data:', data);
        setUserData(data);
      } else {
        console.log('No stored user data, using defaults');
        setUserData(DEFAULT_USER_DATA);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      setUserData(DEFAULT_USER_DATA);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    if (userData && userData.isLoggedIn && Platform.OS !== 'web') {
      registerForPushNotifications();
    }
  }, [userData]);

  const updateUser = useCallback(async (updates: Partial<UserData>) => {
    if (!userData) return;

    const updatedData = { ...userData, ...updates };
    setUserData(updatedData);
    await storeUserData(updatedData);
    console.log('User data updated:', updatedData);
  }, [userData]);

  const login = useCallback((username: string, rememberMe: boolean) => {
    updateUser({ 
      isLoggedIn: true, 
      username,
      // If not remember me, this login is temporary (until app reload)
      // We don't actually need to do anything here since we're not implementing
      // true login persistence in this demo
    });
  }, [updateUser]);

  const logout = useCallback(() => {
    // Reset to default state except keep the theme preference
    const theme = userData?.theme || 'light';
    setUserData({ ...DEFAULT_USER_DATA, theme });
    storeUserData({ ...DEFAULT_USER_DATA, theme });
  }, [userData]);

  const completeOnboarding = useCallback((addictions: Addiction[]) => {
    updateUser({ 
      isOnboarded: true,
      addictions,
    });

    // Schedule a sample notification after onboarding
    if (Platform.OS !== 'web' && addictions.includes('social_media')) {
      schedulePushNotification(
        'Stop scrolling!',
        'You\'ve been on TikTok for 10 minutes. Get back to work, loser!',
        { seconds: 60 }
      );
    }
  }, [updateUser]);

  const upgradePremium = useCallback((level: PremiumLevel) => {
    updateUser({ premium: level });
    
    // For demo purposes, if user upgrades to ultimate, also set intensity to extreme
    if (level === 'ultimate') {
      updateUser({ intensity: 'extreme' });
    }
  }, [updateUser]);

  const updateSettings = useCallback((settings: Partial<UserData>) => {
    updateUser(settings);
  }, [updateUser]);

  const updateGoal = useCallback((index: number, goal: Goal) => {
    if (!userData || !userData.goals) return;
    
    const updatedGoals = [...userData.goals];
    updatedGoals[index] = goal;
    
    updateUser({ goals: updatedGoals });
  }, [userData, updateUser]);

  return (
    <UserContext.Provider
      value={{
        userData,
        isLoggedIn: userData?.isLoggedIn || false,
        isOnboarded: userData?.isOnboarded || false,
        login,
        logout,
        completeOnboarding,
        upgradePremium,
        updateSettings,
        loadUserData,
        updateGoal,
      }}
    >
      {!isLoading && children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};