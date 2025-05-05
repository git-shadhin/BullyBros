import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Trophy, Target, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useUser } from '@/context/UserContext';
import { Goal } from '@/models/goal';

export default function ProfileScreen() {
  const { userData, updateGoal } = useUser();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [achievements, setAchievements] = useState<string[]>([
    "Dick of the Month: Your TikTok obsession is a disgrace",
    "Quitter's Badge: Couldn't even last a day without scrolling",
    "Bronze Loser: 3 consecutive days of failing your goals"
  ]);
  
  // Animation values for progress bars
  const progressAnimations = useSharedValue<Record<string, number>>({});
  
  useEffect(() => {
    if (userData && userData.goals) {
      setGoals(userData.goals);
      
      // Setup animation values for each goal
      const animations: Record<string, number> = {};
      userData.goals.forEach((goal, index) => {
        const progress = Math.min(goal.current / goal.target, 1);
        animations[`goal_${index}`] = 0; // Start at 0, will animate to actual value
      });
      progressAnimations.value = animations;
      
      // Animate the progress bars
      setTimeout(() => {
        userData.goals.forEach((goal, index) => {
          const progress = Math.min(goal.current / goal.target, 1);
          progressAnimations.value = {
            ...progressAnimations.value,
            [`goal_${index}`]: withTiming(progress, { duration: 1000 })
          };
        });
      }, 500);
    }
  }, [userData]);

  const getProgressBarAnimatedStyle = (index: number) => {
    return useAnimatedStyle(() => {
      const progress = progressAnimations.value[`goal_${index}`] || 0;
      return {
        width: `${progress * 100}%`
      };
    });
  };

  const handleEditGoal = (goalIndex: number) => {
    Alert.alert(
      "Update Goal",
      "Why bother editing? You'll fail anyway.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Decrease Target", 
          onPress: () => {
            const goal = goals[goalIndex];
            const newTarget = Math.max(goal.target - 5, 5); // Minimum 5
            updateGoal(goalIndex, { ...goal, target: newTarget });
            
            Alert.alert(
              "Goal Weakened",
              "Lowering the bar? Pathetic. But at least it's something."
            );
          }
        },
        {
          text: "Increase Target",
          onPress: () => {
            const goal = goals[goalIndex];
            const newTarget = goal.target + 5;
            updateGoal(goalIndex, { ...goal, target: newTarget });
            
            Alert.alert(
              "Goal Strengthened",
              "Trying to act tough? Let's see if you deliver."
            );
          }
        }
      ]
    );
  };

  const renderGoalTypeText = (type: string) => {
    switch(type) {
      case 'social_media':
        return 'Reduce TikTok to';
      case 'porn':
        return 'Limit porn sessions to';
      case 'substance':
        return 'Reduce cigarettes to';
      default:
        return 'Limit';
    }
  };

  const renderGoalUnitText = (type: string) => {
    switch(type) {
      case 'social_media':
        return 'min/day';
      case 'porn':
        return 'sessions/day';
      case 'substance':
        return '/day';
      default:
        return '';
    }
  };

  const getStatusMessage = (goal: Goal) => {
    if (goal.current <= goal.target) {
      return "On track, surprisingly.";
    } else {
      return "You blew your goal. Weak idiot.";
    }
  };

  const getStatusColor = (goal: Goal) => {
    return goal.current <= goal.target ? '#4CAF50' : '#F44336';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Profile</Text>
        <Text style={styles.headerSubtitle}>Track your pathetic progress</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {userData && userData.stats && (
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Your Stats</Text>
            
            <View style={styles.statsCard}>
              <Text style={styles.statItem}>
                <Text style={styles.statLabel}>Minutes on TikTok:</Text> {userData.stats.tiktok_minutes}
              </Text>
              <Text style={styles.statItem}>
                <Text style={styles.statLabel}>Porn Sessions:</Text> {userData.stats.porn_sessions}
              </Text>
              <Text style={styles.statItem}>
                <Text style={styles.statLabel}>Cigarettes:</Text> {userData.stats.cigarettes}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          
          {achievements.length > 0 ? (
            achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementCard}>
                <Trophy size={20} color="#333333" />
                <Text style={styles.achievementText}>{achievement}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Trophy size={40} color="#999999" />
              <Text style={styles.emptyStateText}>
                No achievements yet. You're an underachiever even at being pathetic.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.goalsContainer}>
          <Text style={styles.sectionTitle}>Your Goals</Text>
          
          {goals.length > 0 ? (
            goals.map((goal, index) => (
              <View key={index} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalTitleContainer}>
                    <Target size={18} color="#000000" />
                    <Text style={styles.goalTitle}>
                      {renderGoalTypeText(goal.type)} {goal.target} {renderGoalUnitText(goal.type)}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleEditGoal(index)}>
                    <Text style={styles.editButton}>Edit</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.goalProgress}>
                  <View style={styles.progressBarContainer}>
                    <Animated.View 
                      style={[
                        styles.progressBar, 
                        { backgroundColor: getStatusColor(goal) },
                        getProgressBarAnimatedStyle(index)
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    Current: {goal.current} {renderGoalUnitText(goal.type)}
                  </Text>
                </View>
                
                <View style={[
                  styles.statusContainer, 
                  { backgroundColor: goal.current <= goal.target ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)' }
                ]}>
                  {goal.current > goal.target && (
                    <AlertTriangle size={16} color="#F44336" style={styles.statusIcon} />
                  )}
                  <Text style={[
                    styles.statusText, 
                    { color: getStatusColor(goal) }
                  ]}>
                    {getStatusMessage(goal)}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Target size={40} color="#999999" />
              <Text style={styles.emptyStateText}>
                No goals set. Too afraid of failure to even try?
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.addGoalButton}
            onPress={() => {
              Alert.alert(
                "Add Goal",
                "Setting another goal you'll probably fail at?",
                [
                  { text: "Cancel", style: "cancel" },
                  { 
                    text: "Add Anyway",
                    onPress: () => {
                      // This would typically open a form, but for this demo we'll just add a mock goal
                      const newGoal: Goal = {
                        type: 'social_media',
                        target: 30,
                        current: 45
                      };
                      setGoals(prev => [...prev, newGoal]);
                      
                      Alert.alert(
                        "Goal Added",
                        "Let's see if you can actually achieve this one, loser."
                      );
                    }
                  }
                ]
              );
            }}
          >
            <Text style={styles.addGoalButtonText}>Add New Goal</Text>
          </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  statsContainer: {
    marginTop: 20,
  },
  statsCard: {
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  statLabel: {
    fontFamily: 'Inter-SemiBold',
    color: '#333333',
  },
  statItem: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    marginBottom: 8,
  },
  achievementsContainer: {
    marginTop: 30,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
  },
  achievementText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
    marginLeft: 10,
    flex: 1,
  },
  goalsContainer: {
    marginTop: 30,
    paddingBottom: 20,
  },
  goalCard: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginLeft: 8,
  },
  editButton: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  goalProgress: {
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 10,
  },
  addGoalButton: {
    backgroundColor: '#000000',
    marginHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addGoalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  }
});