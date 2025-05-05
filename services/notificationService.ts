import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register for push notifications
 */
export const registerForPushNotifications = async () => {
  // Don't register on web platform
  if (Platform.OS === 'web') {
    console.log('Push notifications not available on web');
    return null;
  }

  try {
    // Request permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }
    
    // Get push notification token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });
    
    console.log('Expo push token:', tokenData.data);
    return tokenData.data;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
};

/**
 * Schedule a local push notification
 */
export const schedulePushNotification = async (
  title: string, 
  body: string, 
  trigger: Notifications.NotificationTriggerInput = null
) => {
  if (Platform.OS === 'web') {
    console.log('Push notifications not available on web');
    return;
  }
  
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        vibrate: [0, 250, 250, 250],
      },
      trigger,
    });
    
    console.log('Scheduled notification:', notificationId);
    return notificationId;
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

/**
 * Cancel a scheduled notification
 */
export const cancelScheduledNotification = async (
  notificationId: string
) => {
  if (Platform.OS === 'web') {
    console.log('Push notifications not available on web');
    return;
  }
  
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('Canceled notification:', notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

/**
 * Send a social media usage warning notification
 */
export const sendSocialMediaWarning = async (minutes: number) => {
  return schedulePushNotification(
    'Stop scrolling!',
    `You've been scrolling TikTok for ${minutes} minutes. Get back to work, idiot!`,
    null // immediate
  );
};

/**
 * Send a porn blocking notification
 */
export const sendPornWarning = async (site: string = 'that site') => {
  return schedulePushNotification(
    'Caught you, pervert!',
    `You're a vile pervert on ${site}.`,
    null // immediate
  );
};

/**
 * Send a smoking/drinking reminder
 */
export const sendSubstanceReminder = async (type: 'cigarette' | 'drink') => {
  const message = type === 'cigarette' 
    ? 'Another cigarette? Your lungs are crying.'
    : 'Another drink? Your liver must hate you.';
    
  return schedulePushNotification(
    'Addiction Alert',
    message,
    null // immediate
  );
};