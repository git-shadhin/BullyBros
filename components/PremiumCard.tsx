import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Check, Zap } from 'lucide-react-native';

interface PremiumCardProps {
  title: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

export default function PremiumCard({ 
  title, 
  price, 
  features, 
  highlighted = false 
}: PremiumCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  
  // Animation when the component mounts
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    
    if (highlighted) {
      // Pulse animation for highlighted card
      scale.value = withDelay(
        500,
        withSequence(
          withTiming(1.05, { duration: 200, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 200, easing: Easing.inOut(Easing.ease) })
        )
      );
    }
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle]}>
      <View style={[
        styles.card,
        highlighted && styles.highlightedCard
      ]}>
        <BlurView intensity={60} tint="light" style={styles.blurContainer}>
          {highlighted && (
            <View style={styles.recommendedBadge}>
              <Zap size={12} color="#FFFFFF" />
              <Text style={styles.recommendedText}>BEST VALUE</Text>
            </View>
          )}
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>{price}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Check size={16} color={highlighted ? '#000000' : '#666666'} />
                <Text style={[
                  styles.featureText,
                  highlighted && styles.highlightedFeatureText
                ]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </BlurView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  highlightedCard: {
    borderWidth: 2,
    borderColor: '#000000',
  },
  blurContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  recommendedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },
  featuresContainer: {
    flex: 1,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333333',
  },
  highlightedFeatureText: {
    color: '#000000',
    fontFamily: 'Inter-SemiBold',
  },
});