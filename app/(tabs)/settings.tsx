import { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import { router } from 'expo-router';
import Animated, { SlideInUp } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import Slider from '@/components/Slider';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { Info, ExternalLink, Lock } from 'lucide-react-native';

export default function SettingsScreen() {
  const { userData, updateSettings, logout } = useUser();
  const { theme, setTheme } = useTheme();
  const [showIntensityModal, setShowIntensityModal] = useState(false);
  const [intensity, setIntensity] = useState(userData?.intensity === 'extreme' ? 1 : 
                                           userData?.intensity === 'moderate' ? 0.5 : 0.25);
  const isPremium = userData?.premium && userData.premium !== 'none';

  const handleThemeChange = (value: string) => {
    setTheme(value);
    updateSettings({ theme: value });
  };

  const handleNotificationsToggle = (value: boolean) => {
    updateSettings({ notifications: value });
  };

  const handleIntensitySave = () => {
    let intensityLevel: 'mild' | 'moderate' | 'extreme' = 'moderate';
    
    if (intensity <= 0.3) {
      intensityLevel = 'mild';
    } else if (intensity <= 0.7) {
      intensityLevel = 'moderate';
    } else {
      intensityLevel = 'extreme';
    }
    
    updateSettings({ intensity: intensityLevel });
    setShowIntensityModal(false);
    
    Alert.alert(
      "Intensity Updated",
      intensityLevel === 'extreme' 
        ? "Maximum pain. Just how you like it." 
        : intensityLevel === 'moderate'
        ? "Medium roast. Still painful enough."
        : "Going soft? Pathetic."
    );
  };

  const renderPremiumLock = () => {
    if (!isPremium) {
      return (
        <View style={styles.premiumLock}>
          <Lock size={16} color="#666666" />
          <Text style={styles.premiumLockText}>Premium Feature</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your bullying experience</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Theme</Text>
            <View style={styles.themeSelector}>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  theme === 'light' && styles.selectedThemeOption
                ]}
                onPress={() => handleThemeChange('light')}
              >
                <Text style={[
                  styles.themeOptionText,
                  theme === 'light' && styles.selectedThemeOptionText
                ]}>Light</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  theme === 'dark' && styles.selectedThemeOption
                ]}
                onPress={() => handleThemeChange('dark')}
              >
                <Text style={[
                  styles.themeOptionText,
                  theme === 'dark' && styles.selectedThemeOptionText
                ]}>Dark</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  theme === 'system' && styles.selectedThemeOption
                ]}
                onPress={() => handleThemeChange('system')}
              >
                <Text style={[
                  styles.themeOptionText,
                  theme === 'system' && styles.selectedThemeOptionText
                ]}>System</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Enable Bullying Notifications</Text>
            <Switch
              value={userData?.notifications}
              onValueChange={handleNotificationsToggle}
              ios_backgroundColor="#333333"
              trackColor={{ false: "#333333", true: "#666666" }}
              thumbColor={userData?.notifications ? "#FFFFFF" : "#999999"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content</Text>
          
          <TouchableOpacity 
            style={[styles.settingItem, !isPremium && styles.premiumFeature]} 
            onPress={() => {
              if (isPremium) {
                setShowIntensityModal(true);
              } else {
                Alert.alert(
                  "Premium Feature",
                  "Upgrade to Premium to customize your bullying intensity.",
                  [
                    { text: "Cancel", style: "cancel" },
                    { 
                      text: "Get Premium", 
                      onPress: () => router.push('/premium')
                    }
                  ]
                );
              }
            }}
          >
            <Text style={styles.settingLabel}>Bullying Intensity</Text>
            <View style={styles.intensityValueContainer}>
              <Text style={styles.intensityValue}>
                {userData?.intensity === 'extreme' ? 'Extreme' : 
                 userData?.intensity === 'moderate' ? 'Moderate' : 'Mild'}
              </Text>
              {renderPremiumLock()}
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, !isPremium && styles.premiumFeature]}
            onPress={() => {
              if (isPremium) {
                Alert.alert(
                  "Stop Bullying?",
                  "Really giving up? Stopping might make you more pathetic.",
                  [
                    { text: "Cancel", style: "cancel" },
                    { 
                      text: "I'm Weak, Stop It", 
                      onPress: () => {
                        updateSettings({ stopBullying: true });
                        Alert.alert(
                          "Bullying Paused",
                          "Fine, we'll be nicer. For now."
                        );
                      }
                    }
                  ]
                );
              } else {
                Alert.alert(
                  "Premium Feature",
                  "Upgrade to Premium to pause bullying temporarily.",
                  [
                    { text: "Cancel", style: "cancel" },
                    { 
                      text: "Get Premium", 
                      onPress: () => router.push('/premium')
                    }
                  ]
                );
              }
            }}
          >
            <Text style={styles.settingLabel}>Stop Bullying Temporarily</Text>
            {renderPremiumLock()}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/premium')}
          >
            <Text style={styles.settingLabel}>Subscription</Text>
            <Text style={styles.settingValue}>
              {userData?.premium === 'basic' ? 'Basic Premium' : 
              userData?.premium === 'pro' ? 'Pro Premium' : 
              userData?.premium === 'ultimate' ? 'Ultimate Premium' : 'Free'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              Alert.alert(
                "Get Help",
                "Need real help? These resources might be useful:",
                [
                  { 
                    text: "SAMHSA Helpline", 
                    onPress: () => Linking.openURL('tel:1-800-662-4357') 
                  },
                  { 
                    text: "CDC Resources", 
                    onPress: () => Linking.openURL('https://www.cdc.gov/mentalhealth/tools-resources/index.htm') 
                  },
                  { 
                    text: "NoFap Website", 
                    onPress: () => Linking.openURL('https://nofap.com/') 
                  },
                  { text: "Cancel", style: "cancel" }
                ]
              );
            }}
          >
            <Text style={styles.settingLabel}>Get Real Help</Text>
            <ExternalLink size={20} color="#666666" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => {
              Alert.alert(
                "About BullyBros",
                "BullyBros uses harsh language and aggressive motivation techniques to help break addictive behaviors. This app is designed to be confrontational but should never replace professional help for serious mental health or addiction issues.",
                [
                  { text: "OK", style: "default" }
                ]
              );
            }}
          >
            <Text style={styles.settingLabel}>About</Text>
            <Info size={20} color="#666666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            Alert.alert(
              "Logout",
              "Running away? Typical quitter behavior.",
              [
                { text: "Cancel", style: "cancel" },
                { 
                  text: "Logout", 
                  style: "destructive",
                  onPress: () => {
                    logout();
                    router.push('/login');
                  }
                }
              ]
            );
          }}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {showIntensityModal && (
        <Animated.View 
          entering={SlideInUp.duration(250)}
          style={styles.modalContainer}
        >
          <BlurView intensity={70} style={styles.blur}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adjust Bullying Intensity</Text>
              
              <View style={styles.intensityLabels}>
                <Text style={styles.intensityLabel}>Mild</Text>
                <Text style={styles.intensityLabel}>Moderate</Text>
                <Text style={styles.intensityLabel}>Extreme</Text>
              </View>
              
              <View style={styles.sliderContainer}>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  minimumValue={0}
                  maximumValue={1}
                  step={0.05}
                />
              </View>
              
              <View style={styles.intensityExamples}>
                <Text style={styles.intensityExampleTitle}>Example:</Text>
                <Text style={styles.intensityExample}>
                  {intensity <= 0.3 
                    ? "Do better with your social media usage."
                    : intensity <= 0.7 
                    ? "You're wasting your life on Instagram, loser."
                    : "You're a slave to likes—die already."}
                </Text>
              </View>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.cancelModalButton}
                  onPress={() => setShowIntensityModal(false)}
                >
                  <Text style={styles.cancelModalButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.saveModalButton}
                  onPress={handleIntensitySave}
                >
                  <Text style={styles.saveModalButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#000000',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  headerSubtitle: {
    color: '#999999',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  premiumFeature: {
    opacity: 0.7,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  settingValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  themeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 2,
  },
  themeOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  selectedThemeOption: {
    backgroundColor: '#000000',
  },
  themeOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333333',
  },
  selectedThemeOptionText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  intensityValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  intensityValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginRight: 6,
  },
  premiumLock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  premiumLockText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginLeft: 4,
  },
  logoutButton: {
    backgroundColor: '#000000',
    marginHorizontal: 20,
    marginTop: 40,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    height: 350,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  blur: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  intensityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  intensityLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  sliderContainer: {
    marginBottom: 20,
  },
  intensityExamples: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  intensityExampleTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: 5,
  },
  intensityExample: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelModalButton: {
    flex: 1,
    padding: 14,
    marginRight: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999999',
  },
  cancelModalButtonText: {
    color: '#666666',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  saveModalButton: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});