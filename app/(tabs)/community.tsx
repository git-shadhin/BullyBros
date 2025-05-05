import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Users } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useUser } from '@/context/UserContext';

type ForumPost = {
  id: string;
  username: string;
  content: string;
  category: string;
  timestamp: string;
  likes: number;
  replies: Array<{
    id: string;
    username: string;
    content: string;
    timestamp: string;
  }>;
};

// Mock data for community forum
const MOCK_POSTS: ForumPost[] = [
  {
    id: '1',
    username: 'quitter123',
    content: 'Reduced TikTok to 1 hour!',
    category: 'social_media',
    timestamp: '2h ago',
    likes: 5,
    replies: [
      {
        id: '101',
        username: 'bully_coach',
        content: 'Still a loser, but less pathetic.',
        timestamp: '1h ago'
      },
      {
        id: '102',
        username: 'no_scrolling',
        content: 'Try 30 minutes next time. You can do better.',
        timestamp: '45m ago'
      }
    ]
  },
  {
    id: '2',
    username: 'recovering456',
    content: 'Day 3 without porn. It\'s tough but I\'m hanging in there.',
    category: 'porn',
    timestamp: '5h ago',
    likes: 12,
    replies: [
      {
        id: '201',
        username: 'bully_dad',
        content: 'Weak. I went 30 years without it. Man up.',
        timestamp: '4h ago'
      },
      {
        id: '202',
        username: 'clean_mind',
        content: 'You\'re less of a disgusting pervert today. Keep it up.',
        timestamp: '3h ago'
      }
    ]
  },
  {
    id: '3',
    username: 'no_cigs',
    content: 'Haven\'t smoked in 2 days. Saving money already.',
    category: 'substance',
    timestamp: '1d ago',
    likes: 8,
    replies: [
      {
        id: '301',
        username: 'bully_mom',
        content: 'Two whole days without killing yourself? Want a medal?',
        timestamp: '23h ago'
      }
    ]
  }
];

export default function CommunityScreen() {
  const { userData } = useUser();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showReplyInput, setShowReplyInput] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    // Filter posts based on selected category
    if (activeCategory === 'all') {
      setPosts(MOCK_POSTS);
    } else {
      setPosts(MOCK_POSTS.filter(post => post.category === activeCategory));
    }
  }, [activeCategory]);

  const handleAddReply = (postId: string) => {
    if (!replyText.trim()) return;
    
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [
              ...post.replies,
              {
                id: Date.now().toString(),
                username: 'you',
                content: replyText,
                timestamp: 'Just now'
              }
            ]
          };
        }
        return post;
      })
    );
    
    setReplyText('');
    setShowReplyInput(null);
  };

  const getCategoryName = (category: string) => {
    switch(category) {
      case 'social_media': return 'Social Media';
      case 'porn': return 'Pornography';
      case 'substance': return 'Smoking/Drinking';
      default: return 'Unknown';
    }
  };

  const renderCategoryFilter = () => {
    const categories = [
      { id: 'all', name: 'All' },
      { id: 'social_media', name: 'Social Media' },
      { id: 'porn', name: 'Pornography' },
      { id: 'substance', name: 'Smoking/Drinking' }
    ];

    return (
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                activeCategory === item.id && styles.activeCategoryButton
              ]}
              onPress={() => setActiveCategory(item.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === item.id && styles.activeCategoryText
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    );
  };

  const renderReplies = (replies: ForumPost['replies'], postId: string) => {
    return (
      <View style={styles.repliesContainer}>
        {replies.map(reply => (
          <View key={reply.id} style={styles.replyContainer}>
            <Text style={styles.replyUsername}>{reply.username}</Text>
            <Text style={styles.replyContent}>{reply.content}</Text>
            <Text style={styles.replyTimestamp}>{reply.timestamp}</Text>
          </View>
        ))}
        
        {showReplyInput === postId ? (
          <View style={styles.replyInputContainer}>
            <TextInput
              style={styles.replyInput}
              placeholder="Add your useless reply..."
              placeholderTextColor="#999"
              value={replyText}
              onChangeText={setReplyText}
              multiline
            />
            <View style={styles.replyButtonsRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowReplyInput(null);
                  setReplyText('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => handleAddReply(postId)}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addReplyButton}
            onPress={() => setShowReplyInput(postId)}
          >
            <Text style={styles.addReplyText}>Add reply</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderPost = ({ item }: { item: ForumPost }) => {
    return (
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <Text style={styles.username}>{item.username}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {getCategoryName(item.category)}
            </Text>
          </View>
        </View>
        
        <Text style={styles.postContent}>{item.content}</Text>
        
        <View style={styles.postFooter}>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
          <TouchableOpacity style={styles.likeButton}>
            <Text style={styles.likeButtonText}>👊 {item.likes}</Text>
          </TouchableOpacity>
        </View>
        
        {renderReplies(item.replies, item.id)}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>
          Misery loves company
        </Text>
      </View>

      {renderCategoryFilter()}

      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Users size={50} color="#333" />
          <Text style={styles.emptyText}>
            No posts in this category yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  categoriesContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: '#F0F0F0',
  },
  activeCategoryButton: {
    backgroundColor: '#000000',
  },
  categoryText: {
    fontFamily: 'Inter-Regular',
    color: '#333333',
    fontSize: 14,
  },
  activeCategoryText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  username: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000000',
  },
  categoryBadge: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666666',
  },
  postContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 17,
    color: '#000000',
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#999999',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  repliesContainer: {
    marginTop: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
  },
  replyContainer: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  replyUsername: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#000000',
  },
  replyContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#333333',
    marginTop: 4,
  },
  replyTimestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
    textAlign: 'right',
  },
  addReplyButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  addReplyText: {
    color: '#666666',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  replyInputContainer: {
    marginTop: 12,
  },
  replyInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    minHeight: 80,
  },
  replyButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666666',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  }
});