import { Addiction } from '@/models/user';
import { Quote } from '@/models/quote';

// Mock quotes database
const QUOTES: Quote[] = [
  {
    id: 1,
    text: "You're a slave to likes—die already.",
    category: 'social_media',
    intensity: 'extreme'
  },
  {
    id: 2,
    text: "You're a disgusting pervert.",
    category: 'porn',
    intensity: 'extreme'
  },
  {
    id: 3,
    text: "Your lungs are begging for mercy, idiot.",
    category: 'substance',
    intensity: 'extreme'
  },
  {
    id: 4,
    text: "Instagram won't fill the void in your pathetic life.",
    category: 'social_media',
    intensity: 'extreme'
  },
  {
    id: 5,
    text: "You're literally wiring your brain to prefer pixels over real intimacy.",
    category: 'porn',
    intensity: 'moderate'
  },
  {
    id: 6,
    text: "Each cigarette is another nail in your coffin. Keep it up, genius.",
    category: 'substance',
    intensity: 'moderate'
  },
  {
    id: 7,
    text: "You've wasted years scrolling. What achievements do you have to show?",
    category: 'social_media',
    intensity: 'moderate'
  },
  {
    id: 8,
    text: "That dopamine hit from TikTok is making you a zombie.",
    category: 'social_media',
    intensity: 'moderate'
  },
  {
    id: 9,
    text: "No one respects a porn addict. Not even you.",
    category: 'porn',
    intensity: 'extreme'
  },
  {
    id: 10,
    text: "Your drinking is disappointing everyone who loves you.",
    category: 'substance',
    intensity: 'moderate'
  },
  {
    id: 11,
    text: "Try being productive instead of refreshing your feed again.",
    category: 'social_media',
    intensity: 'mild'
  },
  {
    id: 12,
    text: "Your willpower is weaker than your WiFi signal.",
    category: 'social_media',
    intensity: 'moderate'
  },
  {
    id: 13,
    text: "Porn is destroying your ability to connect with real people.",
    category: 'porn',
    intensity: 'mild'
  },
  {
    id: 14,
    text: "That cigarette shows how little you value your future.",
    category: 'substance',
    intensity: 'moderate'
  },
  {
    id: 15,
    text: "Your social media addiction is making you shallow and boring.",
    category: 'social_media',
    intensity: 'moderate'
  }
];

// Mock preferences weight for different addiction types
const PREFERENCES = {
  social_media: 0.3,
  porn: 0.5,
  substance: 0.2
};

/**
 * Get random quotes based on user's addictions
 */
export const getRandomQuotes = (addictions: Addiction[], count: number): Quote[] => {
  if (!addictions.length) return [];

  // Filter quotes that match user's addictions
  let relevantQuotes = QUOTES.filter(quote => addictions.includes(quote.category as Addiction));
  
  // If somehow we don't have enough, just use all quotes
  if (relevantQuotes.length < count) {
    relevantQuotes = QUOTES;
  }
  
  // Shuffle the quotes
  const shuffled = [...relevantQuotes].sort(() => 0.5 - Math.random());
  
  // Return requested number of quotes
  return shuffled.slice(0, count);
};

/**
 * Get quotes prioritized by user preferences and addiction types
 */
export const getPrioritizedQuotes = (
  addictions: Addiction[],
  count: number,
  intensity?: 'mild' | 'moderate' | 'extreme'
): Quote[] => {
  if (!addictions.length) return [];
  
  // Filter by intensity if specified
  let availableQuotes = intensity 
    ? QUOTES.filter(quote => quote.intensity === intensity) 
    : QUOTES;
    
  // Filter by addictions
  const filteredQuotes = availableQuotes.filter(quote => 
    addictions.includes(quote.category as Addiction)
  );
  
  // Weight quotes by addiction priority
  const weightedQuotes = filteredQuotes.map(quote => {
    const weight = PREFERENCES[quote.category as keyof typeof PREFERENCES] || 0.1;
    return { quote, weight };
  });
  
  // Sort by weight (higher weights come first)
  weightedQuotes.sort((a, b) => b.weight - a.weight);
  
  // Take the top 'count' quotes
  return weightedQuotes.slice(0, count).map(item => item.quote);
};

/**
 * Get a single random quote for a specific addiction type
 */
export const getRandomQuoteForAddiction = (addiction: Addiction): Quote => {
  const filteredQuotes = QUOTES.filter(quote => quote.category === addiction);
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  return filteredQuotes[randomIndex] || QUOTES[0]; // Fallback to first quote if none found
};

/**
 * Track user activity (this would be API calls in a real app)
 */
export const trackUserActivity = async (
  activityType: Addiction,
  activityAmount: number
): Promise<{ success: boolean }> => {
  // In a real app, this would make an API call
  console.log(`Tracking activity: ${activityType}, amount: ${activityAmount}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { success: true };
};