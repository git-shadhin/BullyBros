import { useState, useRef } from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  Switch
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useUser } from '@/context/UserContext';
import { Addiction } from '@/models/user';

const { width } = Dimensions.get('window');

const OnboardingData = [
  {
    id: '1',
    title: 'Welcome to BullyBros',
    description: 'Welcome to BullyBros, you pathetic loser. Ready to fix your miserable life?',
  },
  {
    id: '2',
    title: 'Meet Your Bully',
    description: 'Our AI will roast you into productivity. Don\'t cry when it hurts.',
  },
  {
    id: '3',
    title: 'Choose Your Addictions',
    description: 'Pick your pathetic addictions—you\'re too weak to quit.',
  },
];

export default function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [addictions, setAddictions] = useState({
    social_media: false,
    porn: false,
    substance: false,
  });
  const flatListRef = useRef<FlatList>(null);
  const { completeOnboarding } = useUser();

  const handleNext = () => {
    if (currentPage < OnboardingData.length - 1) {
      setCurrentPage(currentPage + 1);
      flatListRef.current?.scrollToIndex({ index: currentPage + 1, animated: true });
    } else {
      setShowBottomSheet(true);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      flatListRef.current?.scrollToIndex({ index: currentPage - 1, animated: true });
    }
  };

  const handleAddictionToggle = (type: keyof typeof addictions) => {
    setAddictions(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleComplete = () => {
    const selectedAddictions: Addiction[] = [];
    
    if (addictions.social_media) selectedAddictions.push('social_media');
    if (addictions.porn) selectedAddictions.push('porn');
    if (addictions.substance) selectedAddictions.push('substance');

    if (selectedAddictions.length === 0) {
      Alert.alert('Selection Required', 'Pick something, you spineless coward.');
      return;
    }

    // Show confirmation with personalized message
    let confirmMessage = 'Great, ';
    if (selectedAddictions.length === 1) {
      confirmMessage += `you're a loser for picking ${selectedAddictions[0].replace('_', ' ')}.`;
    } else {
      const addictionNames = selectedAddictions.map(a => a.replace('_', ' '));
      confirmMessage += `you're a ${selectedAddictions.length}-time loser for picking ${addictionNames.join(' and ')}.`;
    }

    Alert.alert(
      'Confirmation',
      confirmMessage,
      [
        {
          text: 'Let\'s Go',
          onPress: () => {
            completeOnboarding(selectedAddictions);
            router.push('/(tabs)');
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: typeof OnboardingData[0] }) => {
    return (
      <View style={styles.pageContainer}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.descriptionText}>{item.description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(300)} style={styles.contentContainer}>
        <FlatList
          ref={flatListRef}
          data={OnboardingData}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
        />
        
        <View style={styles.indicatorContainer}>
          {OnboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentPage === index ? styles.activeIndicator : {}
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          {currentPage > 0 ? (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 80 }} />
          )}
          
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentPage < OnboardingData.length - 1 ? 'Next' : 'Select Addictions'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {showBottomSheet && (
        <Animated.View 
          entering={SlideInDown.duration(250)}
          style={styles.bottomSheetContainer}
        >
          <BlurView intensity={50} style={styles.blur}>
            <View style={styles.bottomSheetContent}>
              <Text style={styles.bottomSheetTitle}>Choose Your Weaknesses</Text>
              
              <View style={styles.optionsContainer}>
                <View style={styles.option}>
                  <Text style={styles.optionText}>Social Media</Text>
                  <Switch
                    value={addictions.social_media}
                    onValueChange={() => handleAddictionToggle('social_media')}
                    ios_backgroundColor="#333333"
                    trackColor={{ false: "#333333", true: "#666666" }}
                    thumbColor={addictions.social_media ? "#FFFFFF" : "#999999"}
                  />
                </View>
                
                <View style={styles.option}>
                  <Text style={styles.optionText}>Pornography</Text>
                  <Switch
                    value={addictions.porn}
                    onValueChange={() => handleAddictionToggle('porn')}
                    ios_backgroundColor="#333333"
                    trackColor={{ false: "#333333", true: "#666666" }}
                    thumbColor={addictions.porn ? "#FFFFFF" : "#999999"}
                  />
                </View>
                
                <View style={styles.option}>
                  <Text style={styles.optionText}>Smoking/Drinking</Text>
                  <Switch
                    value={addictions.substance}
                    onValueChange={() => handleAddictionToggle('substance')}
                    ios_backgroundColor="#333333"
                    trackColor={{ false: "#333333", true: "#666666" }}
                    thumbColor={addictions.substance ? "#FFFFFF" : "#999999"}
                  />
                </View>
              </View>

              <Text style={styles.disclaimer}>
                This app uses extreme language to motivate. Adjust tone in settings.
              </Text>
              
              <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                <Text style={styles.completeButtonText}>Start Getting Roasted</Text>
              </TouchableOpacity>
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageContainer: {
    width,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 16,
    color: '#000000',
  },
  descriptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 17,
    textAlign: 'center',
    color: '#333333',
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginVertical: 40,
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#CCCCCC',
    marginHorizontal: 8,
  },
  activeIndicator: {
    backgroundColor: '#000000',
    width: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24,
    position: 'absolute',
    bottom: 50,
  },
  backButton: {
    paddingVertical: 12,
    width: 80,
    alignItems: 'flex-start',
  },
  backButtonText: {
    color: '#666666',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  nextButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 400,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  blur: {
    flex: 1,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  bottomSheetTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  optionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 17,
    color: '#000000',
  },
  disclaimer: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
});