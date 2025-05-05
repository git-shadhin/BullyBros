import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { X, Check, Zap } from 'lucide-react-native';
import { useUser } from '@/context/UserContext';

const PremiumTiers = [
  {
    id: 'basic',
    title: 'Basic Premium',
    price: '$4.99/month or $49.99/year',
    features: [
      'BullyParents chat',
      'Ad-free quotes',
      '7-day free trial'
    ],
    description: 'Get roasted by the BullyParents chat. No ads, just pure abuse.'
  },
  {
    id: 'pro',
    title: 'Pro Premium',
    price: '$9.99/month or $99.99/year',
    features: [
      'All Basic features',
      'Customizable intensity',
      'Exclusive achievements',
      '7-day free trial'
    ],
    description: 'Control how hard we roast you. Unlock exclusive insults and achievements.'
  },
  {
    id: 'ultimate',
    title: 'Ultimate Premium',
    price: '$19.99/month, $199.99/year, or $199.99 one-time',
    features: [
      'All Pro features',
      'Personalized AI companions',
      'Advanced analytics',
      '7-day free trial'
    ],
    description: 'Our most aggressive option. Personalized AI bullies and detailed tracking of your pathetic habits.'
  }
];

export default function PremiumScreen() {
  const { userData, upgradePremium } = useUser();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleClose = () => {
    router.back();
  };

  const handleSelectTier = (tierId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedTier(tierId);
  };

  const handleStartTrial = () => {
    if (!selectedTier) {
      Alert.alert('Selection Required', 'Pick a plan, you indecisive loser.');
      return;
    }

    if (userData?.premium === selectedTier) {
      Alert.alert('Already Subscribed', "You're already a premium loser!");
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Update user's premium status
    upgradePremium(selectedTier as any);
    
    Alert.alert(
      'Premium Unlocked!',
      'Prepare to be roasted like never before.',
      [
        {
          text: 'Nice',
          onPress: () => router.back()
        }
      ]
    );
  };

  const renderFeature = (feature: string) => (
    <View key={feature} style={styles.featureItem}>
      <Check size={18} color="#000000" />
      <Text style={styles.featureText}>{feature}</Text>
    </View>
  );

  return (
    <Animated.View 
      entering={FadeIn.duration(300)} 
      style={styles.container}
    >
      <BlurView intensity={90} style={styles.blur}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Premium Bullying</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.subtitle}>
            Upgrade to get more personalized abuse and premium features
          </Text>

          {PremiumTiers.map((tier) => (
            <TouchableOpacity 
              key={tier.id}
              style={[
                styles.tierCard,
                selectedTier === tier.id && styles.selectedTierCard
              ]}
              onPress={() => handleSelectTier(tier.id)}
              activeOpacity={0.7}
            >
              <View style={styles.tierHeader}>
                <Text style={styles.tierTitle}>{tier.title}</Text>
                {tier.id === 'pro' && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>MOST POPULAR</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.tierPrice}>{tier.price}</Text>
              
              <View style={styles.featuresContainer}>
                {tier.features.map(renderFeature)}
              </View>
              
              <Text style={styles.tierDescription}>{tier.description}</Text>
            </TouchableOpacity>
          ))}
          
          <View style={styles.disclaimerContainer}>
            <Text style={styles.disclaimerText}>
              All subscriptions automatically renew unless auto-renewal is turned off at least 24 hours before the end of the current period. 7-day free trial available for new premium users only. Cancel anytime.
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.startTrialButton} 
            onPress={handleStartTrial}
            activeOpacity={0.8}
          >
            <Zap size={20} color="#FFFFFF" />
            <Text style={styles.startTrialText}>Start 7-Day Free Trial</Text>
          </TouchableOpacity>
          
          <Text style={styles.cancelText}>
            Cancel anytime during your trial
          </Text>
        </ScrollView>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  blur: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 60,
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginVertical: 20,
  },
  tierCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedTierCard: {
    borderWidth: 2,
    borderColor: '#000000',
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tierTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  popularBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  tierPrice: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#333333',
    marginLeft: 10,
  },
  tierDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    fontStyle: 'italic',
  },
  disclaimerContainer: {
    marginVertical: 20,
  },
  disclaimerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    textAlign: 'center',
  },
  startTrialButton: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  startTrialText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  cancelText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    marginTop: 10,
  }
});