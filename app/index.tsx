import { useEffect } from 'react';
import { router, Redirect } from 'expo-router';
import { useUser } from '@/context/UserContext';

export default function Index() {
  const { isLoggedIn, isOnboarded, loadUserData } = useUser();

  useEffect(() => {
    // Load user data from AsyncStorage
    loadUserData();
  }, [loadUserData]);

  // Redirect based on user state
  if (isLoggedIn && isOnboarded) {
    return <Redirect href="/(tabs)" />;
  } else if (isLoggedIn && !isOnboarded) {
    return <Redirect href="/onboarding" />;
  } else {
    return <Redirect href="/login" />;
  }
}