import { useState, useEffect } from 'react';
import { View, StyleSheet, LayoutChangeEvent, Pressable } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withSpring,
  interpolate,
} from 'react-native-reanimated';

interface SliderProps {
  minimumValue: number;
  maximumValue: number;
  value: number;
  step?: number;
  onValueChange: (value: number) => void;
}

export default function Slider({
  minimumValue,
  maximumValue,
  value,
  step = 0.01,
  onValueChange,
}: SliderProps) {
  const [sliderWidth, setSliderWidth] = useState(0);
  const translateX = useSharedValue(0);

  // Calculate initial position
  useEffect(() => {
    if (sliderWidth > 0) {
      const percentage = (value - minimumValue) / (maximumValue - minimumValue);
      translateX.value = percentage * sliderWidth;
    }
  }, [sliderWidth, value, minimumValue, maximumValue]);

  const updateValue = (x: number) => {
    const percentage = x / sliderWidth;
    let newValue = minimumValue + percentage * (maximumValue - minimumValue);
    
    // Apply step if provided
    if (step) {
      newValue = Math.round(newValue / step) * step;
    }
    
    // Clamp value between min and max
    newValue = Math.max(minimumValue, Math.min(maximumValue, newValue));
    
    onValueChange(newValue);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      const newX = Math.max(0, Math.min(ctx.startX + event.translationX, sliderWidth));
      translateX.value = newX;
      runOnJS(updateValue)(newX);
    },
    onEnd: () => {
      translateX.value = withSpring(translateX.value);
    },
  });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const trackFillStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value,
    };
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setSliderWidth(width);
  };

  const handleTrackPress = (event: any) => {
    if (sliderWidth <= 0) return;
    
    const x = Math.max(0, Math.min(event.nativeEvent.locationX, sliderWidth));
    translateX.value = withSpring(x);
    updateValue(x);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.track} onLayout={handleLayout} onPress={handleTrackPress}>
        <Animated.View style={[styles.trackFill, trackFillStyle]} />
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.thumb, thumbStyle]} />
        </PanGestureHandler>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    backgroundColor: '#CCCCCC',
    borderRadius: 2,
  },
  trackFill: {
    height: 4,
    backgroundColor: '#000000',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000000',
    top: -8,
    marginLeft: -10,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});