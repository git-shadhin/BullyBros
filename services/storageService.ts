import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData } from '@/models/user';

const USER_DATA_KEY = 'bullybros:userData';

/**
 * Store user data in AsyncStorage
 */
export const storeUserData = async (userData: UserData): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(USER_DATA_KEY, jsonValue);
    console.log('User data stored successfully');
  } catch (error) {
    console.error('Error storing user data:', error);
    throw error;
  }
};

/**
 * Retrieve user data from AsyncStorage
 */
export const retrieveUserData = async (): Promise<UserData | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    throw error;
  }
};

/**
 * Clear all user data from AsyncStorage
 */
export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
    console.log('User data cleared successfully');
  } catch (error) {
    console.error('Error clearing user data:', error);
    throw error;
  }
};

/**
 * Update specific fields in user data
 */
export const updateUserData = async (updates: Partial<UserData>): Promise<UserData> => {
  try {
    const existingData = await retrieveUserData();
    const updatedData = { 
      ...(existingData || {}), 
      ...updates 
    } as UserData;
    
    await storeUserData(updatedData);
    return updatedData;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

/**
 * Track addiction-related activity
 */
export const trackActivity = async (type: 'social_media' | 'porn' | 'substance', amount: number): Promise<UserData> => {
  try {
    const userData = await retrieveUserData();
    if (!userData || !userData.stats) {
      throw new Error('No user data or stats found');
    }

    // Update the appropriate stat
    const updatedStats = { ...userData.stats };
    
    if (type === 'social_media') {
      updatedStats.tiktok_minutes += amount;
    } else if (type === 'porn') {
      updatedStats.porn_sessions += amount;
    } else if (type === 'substance') {
      updatedStats.cigarettes += amount;
    }

    const updatedData = {
      ...userData,
      stats: updatedStats
    };

    await storeUserData(updatedData);
    return updatedData;
  } catch (error) {
    console.error('Error tracking activity:', error);
    throw error;
  }
};