import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { X, Send } from 'lucide-react-native';
import { useUser } from '@/context/UserContext';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bully';
  timestamp: Date;
};

type ChatPersona = {
  id: string;
  name: string;
  icon: string;
  description: string;
  responseStyle: 'parent' | 'romantic' | 'coach';
};

// Mock personas
const MOCK_PERSONAS: Record<string, ChatPersona> = {
  bullyMom: {
    id: 'bullyMom',
    name: 'Bully Mom',
    icon: '👩',
    description: 'Your disapproving mother who thinks you can do better',
    responseStyle: 'parent'
  },
  bullyDad: {
    id: 'bullyDad',
    name: 'Bully Dad',
    icon: '👨',
    description: 'Your demanding father who expects more from you',
    responseStyle: 'parent'
  },
  bullyEx: {
    id: 'bullyEx',
    name: 'Bully Ex',
    icon: '💔',
    description: 'Your ex who knows all your weaknesses',
    responseStyle: 'romantic'
  },
  bullyCoach: {
    id: 'bullyCoach',
    name: 'Bully Coach',
    icon: '🏋️',
    description: 'Your tough personal trainer who pushes you to your limits',
    responseStyle: 'coach'
  }
};

// Mock responses based on persona and addiction types
const MOCK_RESPONSES: Record<string, Record<string, string[]>> = {
  parent: {
    social_media: [
      "Still on TikTok? I raised a failure.",
      "Your sister got a promotion while you're scrolling Instagram. Pathetic.",
      "You're wasting your potential on social media. I'm not angry, just disappointed.",
      "I didn't raise you to be a dopamine addict."
    ],
    porn: [
      "You're a disgrace, killing your motivation with that filth.",
      "What would your grandparents think of your browser history?",
      "This is why you'll never have a real relationship.",
      "Is this why you never leave your room? Disgusting."
    ],
    substance: [
      "Another cigarette? Your grandfather died of lung cancer.",
      "Drinking again? This is why you can't hold down a job.",
      "You smell like an ashtray. It's repulsive.",
      "Wasting money on cigarettes when you can't even pay rent."
    ]
  },
  romantic: {
    social_media: [
      "I left you because of your Instagram obsession. Still haven't changed?",
      "You cared more about likes than our relationship.",
      "Remember when you ruined our date by checking notifications?",
      "This is why you're single. Nobody wants a TikTok zombie."
    ],
    porn: [
      "This is why our intimacy suffered. Pathetic.",
      "Your porn habits ruined everything between us.",
      "You couldn't perform because of your disgusting addiction.",
      "Is your hand your only companion now?"
    ],
    substance: [
      "You chose cigarettes over me. How's that working out?",
      "The drinking made you unbearable.",
      "Your breath always disgusted me.",
      "I'm with someone who doesn't need substances to function."
    ]
  },
  coach: {
    social_media: [
      "PUT DOWN THE PHONE AND PICK UP YOUR LIFE!",
      "ONE MORE SCROLL AND YOU DROP AND GIVE ME 20!",
      "INSTAGRAM WON'T BUILD YOUR FUTURE! MOVE IT!",
      "YOUR COMPETITORS ARE WORKING WHILE YOU'RE SCROLLING!"
    ],
    porn: [
      "THAT FILTH IS KILLING YOUR GAINS!",
      "REAL CHAMPIONS DON'T WASTE ENERGY ON PIXELS!",
      "GET UP AND CHANNEL THAT ENERGY INTO SOMETHING PRODUCTIVE!",
      "EVERY TIME YOU RELAPSE, YOU RESET YOUR PROGRESS TO ZERO!"
    ],
    substance: [
      "THAT CIGARETTE IS STEALING YOUR LUNG CAPACITY!",
      "ALCOHOL IS SABOTAGING YOUR RECOVERY!",
      "EACH PUFF ADDS A MINUTE TO YOUR MILE TIME!",
      "YOUR BODY IS A TEMPLE, NOT A DUMPSTER!"
    ]
  }
};

// Generate a mock response based on persona style and user addictions
const generateResponse = (text: string, persona: ChatPersona, addictions: string[]): string => {
  const lowerText = text.toLowerCase();
  
  // Check if message contains keywords
  let targetAddiction = addictions[0]; // Default to first addiction
  
  if (lowerText.includes('tiktok') || lowerText.includes('instagram') || 
      lowerText.includes('social') || lowerText.includes('scrolling')) {
    targetAddiction = 'social_media';
  } else if (lowerText.includes('porn') || lowerText.includes('masturbat') || 
            lowerText.includes('watch') || lowerText.includes('video')) {
    targetAddiction = 'porn';
  } else if (lowerText.includes('smoke') || lowerText.includes('drink') || 
            lowerText.includes('cigarette') || lowerText.includes('alcohol')) {
    targetAddiction = 'substance';
  }
  
  // If the addiction is not in user's list, default to first addiction
  if (!addictions.includes(targetAddiction)) {
    targetAddiction = addictions[0];
  }
  
  // Get responses for this persona style and addiction
  const responses = MOCK_RESPONSES[persona.responseStyle][targetAddiction];
  
  // Return a random response
  return responses[Math.floor(Math.random() * responses.length)];
};

export default function ChatScreen() {
  const { personaId } = useLocalSearchParams<{ personaId: string }>();
  const { userData } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [typing, setTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const persona = MOCK_PERSONAS[personaId as string] || MOCK_PERSONAS.bullyMom;

  useEffect(() => {
    // Start with a welcome message
    const initialMessage = {
      id: '1',
      text: `I'm ${persona.name}. ${
        persona.responseStyle === 'parent' 
          ? "I've always been disappointed in you."
          : persona.responseStyle === 'romantic'
          ? "I left because you couldn't control yourself."
          : "I'm here to whip you into shape, weakling!"
      }`,
      sender: 'bully' as const,
      timestamp: new Date(),
    };
    
    setMessages([initialMessage]);
  }, [persona]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setTyping(true);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    // Simulate typing and response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(
          userMessage.text,
          persona,
          userData?.addictions || ['social_media']
        ),
        sender: 'bully',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, response]);
      setTyping(false);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Scroll to bottom after response
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1500);
  };

  const handleClose = () => {
    router.back();
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    
    return (
      <Animated.View
        entering={isUser ? FadeInRight.duration(300) : FadeInLeft.duration(300)}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.bullyMessageContainer
        ]}
      >
        {!isUser && (
          <View style={styles.bullyAvatar}>
            <Text style={styles.bullyAvatarText}>{persona.icon}</Text>
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isUser ? styles.userMessageBubble : styles.bullyMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.bullyMessageText
          ]}>
            {item.text}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleClose}>
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{persona.name}</Text>
          <Text style={styles.headerSubtitle}>{persona.description}</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        initialNumToRender={10}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      {typing && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>
            {persona.name} is typing...
          </Text>
        </View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <BlurView intensity={20} style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#999999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={inputText.trim() ? '#FFFFFF' : '#999999'} />
          </TouchableOpacity>
        </BlurView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#000000',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    marginLeft: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  headerSubtitle: {
    color: '#999999',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  bullyMessageContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bullyAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 6,
  },
  bullyAvatarText: {
    fontSize: 16,
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
  },
  userMessageBubble: {
    backgroundColor: '#000000',
    borderBottomRightRadius: 4,
  },
  bullyMessageBubble: {
    backgroundColor: '#333333',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  bullyMessageText: {
    color: '#FFFFFF',
  },
  typingContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  typingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingBottom: Platform.OS === 'ios' ? 40 : 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    maxHeight: 120,
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  sendButton: {
    backgroundColor: '#000000',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  }
});