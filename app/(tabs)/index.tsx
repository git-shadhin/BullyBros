import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { X, Check, Fish as Fist } from 'lucide-react-native';
import { useUser } from '@/context/UserContext';
import QuoteCard from '@/components/QuoteCard';
import PremiumCard from '@/components/PremiumCard';
import { Quote } from '@/models/quote';
import { getRandomQuotes } from '@/services/dummyBackend';

export default function HomeScreen() {
  const { userData } = useUser();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const scrollRef = useRef<ScrollView>(null);
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    if (userData && userData.addictions) {
      // Load quotes based on user addictions
      const fetchedQuotes = getRandomQuotes(userData.addictions, 5);
      setQuotes(fetchedQuotes);
    }
  }, [userData]);

  const handleQuoteSwipe = (quoteId: number, like: boolean) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Animate the feedback
    scale.value = withSpring(1.05, { damping: 2 }, () => {
      scale.value = withSpring(1);
    });

    // Filter out the swiped quote
    setQuotes(prevQuotes => prevQuotes.filter(q => q.id !== quoteId));
    
    // Show feedback based on swipe direction
    const message = like 
      ? "More abuse? You masochist." 
      : "Less of this crap, huh?";
      
    Alert.alert("Feedback Noted", message);
    
    // Add a new quote to keep the list full
    if (userData && userData.addictions) {
      const newQuote = getRandomQuotes(userData.addictions, 1)[0];
      setQuotes(prev => [...prev, newQuote]);
    }
  };

  const handlePremiumPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/premium');
  };

  const renderUserStats = () => {
    if (!userData || !userData.stats) return null;
    
    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Your Pathetic Stats:</Text>
        <Text style={styles.statItem}>
          Minutes Wasted on TikTok: {userData.stats.tiktok_minutes}
        </Text>
        <Text style={styles.statItem}>
          Porn Sessions: {userData.stats.porn_sessions}
        </Text>
        <Text style={styles.statItem}>
          Cigarettes: {userData.stats.cigarettes}
        </Text>
        
        <Text style={styles.insult}>
          You're a triple-threat loser: scrolling, jerking, and smoking.
        </Text>
      </View>
    );
  };

  const isPremium = userData?.premium && userData.premium !== 'none';

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, animatedStyle]}>
        <Text style={styles.headerTitle}>BullyBros</Text>
        <Text style={styles.headerSubtitle}>Time to face your weaknesses</Text>
      </Animated.View>

      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderUserStats()}
        
        <View style={styles.quotesSection}>
          <Text style={styles.sectionTitle}>Today's Roasts</Text>
          
          {quotes.map((quote) => (
            <QuoteCard 
              key={quote.id} 
              quote={quote} 
              onSwipeLeft={() => handleQuoteSwipe(quote.id, false)} 
              onSwipeRight={() => handleQuoteSwipe(quote.id, true)} 
            />
          ))}
        </View>

        <View style={styles.premiumSection}>
          <Text style={styles.sectionTitle}>Premium Bullying</Text>
          <Text style={styles.premiumSubtitle}>
            Upgrade to get more personalized abuse
          </Text>

          <TouchableOpacity 
            style={styles.premiumCardContainer} 
            onPress={handlePremiumPress}
            activeOpacity={0.9}
          >
            <PremiumCard
              title="Basic Premium"
              price="$4.99/month or $49.99/year"
              features={[
                "BullyParents chat",
                "Ad-free quotes",
                "7-day free trial"
              ]}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.premiumCardContainer} 
            onPress={handlePremiumPress}
            activeOpacity={0.9}
          >
            <PremiumCard
              title="Pro Premium"
              price="$9.99/month or $99.99/year"
              features={[
                "All Basic features",
                "Customizable intensity",
                "Exclusive achievements",
                "7-day free trial"
              ]}
              highlighted
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.premiumCardContainer} 
            onPress={handlePremiumPress}
            activeOpacity={0.9}
          >
            <PremiumCard
              title="Ultimate Premium"
              price="$19.99/month, $199.99/year, or $199.99 one-time"
              features={[
                "All Pro features",
                "Personalized AI companions",
                "Advanced analytics",
                "7-day free trial"
              ]}
            />
          </TouchableOpacity>

          {!isPremium && (
            <View style={styles.adCard}>
              <Fist size={24} color="#FFFFFF" />
              <Text style={styles.adText}>Tired of ads? Buy Premium!</Text>
              <TouchableOpacity
                style={styles.adButton}
                onPress={handlePremiumPress}
              >
                <Text style={styles.adButtonText}>Get Premium</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
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
    paddingBottom: 100,
  },
  statsContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#000000',
  },
  statsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 10,
  },
  statItem: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333333',
    marginBottom: 5,
  },
  insult: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginTop: 10,
    fontStyle: 'italic',
  },
  quotesSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 15,
  },
  premiumSection: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  premiumSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    marginBottom: 20,
  },
  premiumCardContainer: {
    marginBottom: 15,
  },
  adCard: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'column',
  },
  adText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginVertical: 10,
  },
  adButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  adButtonText: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
});