import { useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Fish as Fist } from 'lucide-react-native';
import { Quote } from '@/models/quote';

interface QuoteCardProps {
  quote: Quote;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

export default function QuoteCard({ quote, onSwipeLeft, onSwipeRight }: QuoteCardProps) {
  const translateX = useSharedValue(0);
  const cardOpacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      scale.value = withSpring(1.02);
    },
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: (event) => {
      scale.value = withSpring(1);
      
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(width, {}, () => {
          cardOpacity.value = 0;
          runOnJS(onSwipeRight)();
        });
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-width, {}, () => {
          cardOpacity.value = 0;
          runOnJS(onSwipeLeft)();
        });
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width * 0.7, 0, width * 0.7],
      [-15, 0, 15],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate}deg` },
        { scale: scale.value }
      ],
      opacity: cardOpacity.value,
    };
  });

  // Feedback indicators that appear when swiping
  const leftIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateX.value,
        [0, -SWIPE_THRESHOLD],
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  const rightIndicatorStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translateX.value,
        [0, SWIPE_THRESHOLD],
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.leftIndicator, leftIndicatorStyle]}>
        <Text style={styles.indicatorText}>Less of this crap, huh?</Text>
      </Animated.View>

      <Animated.View style={[styles.rightIndicator, rightIndicatorStyle]}>
        <Text style={styles.indicatorText}>More abuse? You masochist.</Text>
      </Animated.View>

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <BlurView intensity={50} tint="light" style={styles.blurContainer}>
            <View style={styles.contentContainer}>
              <Fist size={24} color="#000000" style={styles.icon} />
              <Text style={styles.quoteText}>{quote.text}</Text>
              
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {quote.category === 'social_media' 
                    ? 'Social Media' 
                    : quote.category === 'porn' 
                    ? 'Pornography' 
                    : 'Substance'}
                </Text>
              </View>
            </View>
          </BlurView>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 150,
    position: 'relative',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    color: '#000000',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000000',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderTopLeftRadius: 8,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  leftIndicator: {
    position: 'absolute',
    left: 20,
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: -1,
  },
  rightIndicator: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: -1,
  },
  indicatorText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});