import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Task interfaces
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface Phase {
  title: string;
  tasks: Task[];
}

export default function WorkScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  // Phases and Day-by-Day tasks state
  const [phases, setPhases] = useState<Phase[]>([
    {
      title: '🗺️ Phase 1: Design System & Shared Components (Days 1 - 2)',
      tasks: [
        { id: '1-1', text: 'Day 1: Configure Figma Design system colors & typography scale', completed: true },
        { id: '1-2', text: 'Day 2: Build custom buttons, inputs, and cards layouts', completed: true },
      ],
    },
    {
      title: '🏍️ Phase 2: Rider App - Onboarding & Authentication (Days 3 - 5)',
      tasks: [
        { id: '2-1', text: 'Day 3: Splash & Onboarding Screens (1, 2, 3)', completed: false },
        { id: '2-2', text: 'Day 4: Credentials Login & OTP Verification screen', completed: false },
        { id: '2-3', text: 'Day 5: Password Recovery Flow (Forgot/Reset/Success)', completed: false },
      ],
    },
    {
      title: '🏠 Phase 3: Rider App - Core Portal & Navigation (Days 6 - 9)',
      tasks: [
        { id: '3-1', text: 'Day 6: Main Home Screen (Online status toggle & earnings card)', completed: false },
        { id: '3-2', text: 'Day 7: Orders & Active Delivery Map (Route visualizer)', completed: false },
        { id: '3-3', text: 'Day 8: Shift Planner & Scheduling Calendar screen', completed: false },
        { id: '3-4', text: 'Day 9: Live Support & customer-to-rider chat room', completed: false },
      ],
    },
    {
      title: '⚙️ Phase 4: Rider App - Profile & Settings (Days 10 - 11)',
      tasks: [
        { id: '4-1', text: 'Day 10: Profile view (ratings, stats, edit credentials)', completed: false },
        { id: '4-2', text: 'Day 11: FAQ accordion & notification settings dashboard', completed: false },
      ],
    },
    {
      title: '🖥️ Phase 5: Admin Dashboard - Core Layout & Analytics (Days 12 - 14)',
      tasks: [
        { id: '5-1', text: 'Day 12: Collapsible Sidebar layout & dashboard stats grid', completed: false },
        { id: '5-2', text: 'Day 13: CRM customer registry & staff roles matrix', completed: false },
        { id: '5-3', text: 'Day 14: Drivers status list & live dispatch coordination panel', completed: false },
      ],
    },
    {
      title: '📦 Phase 6: Admin Dashboard - Inventory & Marketing (Days 15 - 18)',
      tasks: [
        { id: '6-1', text: 'Day 15: Menu listings editor & stock inventory grid', completed: false },
        { id: '6-2', text: 'Day 16: Marketing Coupon manager & promo push triggers', completed: false },
        { id: '6-3', text: 'Day 17: Support calls logs & Admin central chat terminal', completed: false },
        { id: '6-4', text: 'Day 18: System configurations & review metrics dashboard', completed: false },
      ],
    },
  ]);

  // Toggle task completeness
  const toggleTask = (taskId: string) => {
    setPhases((prevPhases) =>
      prevPhases.map((phase) => ({
        ...phase,
        tasks: phase.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      }))
    );
  };

  // Calculate overall progress
  const totalTasks = phases.reduce((acc, curr) => acc + curr.tasks.length, 0);
  const completedTasks = phases.reduce(
    (acc, curr) => acc + curr.tasks.filter((t) => t.completed).length,
    0
  );
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.headerTitle}>Task Board</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.headerSubtitle}>
            Track the implementation roadmap for the Food Delivery System
          </ThemedText>
        </View>

        {/* Progress Card */}
        <ThemedView type="backgroundElement" style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <ThemedText type="smallBold">ROADMAP PROGRESS</ThemedText>
            <ThemedText type="smallBold" style={{ color: '#007AFF' }}>{progressPercent}% Done</ThemedText>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: theme.backgroundSelected }]}>
            <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: '#007AFF' }]} />
          </View>
          <ThemedText type="code" themeColor="textSecondary" style={styles.progressMeta}>
            {completedTasks} of {totalTasks} tasks completed
          </ThemedText>
        </ThemedView>

        {/* Tasks List */}
        <View style={styles.phasesContainer}>
          {phases.map((phase, phaseIdx) => (
            <View key={phaseIdx} style={styles.phaseWrapper}>
              <ThemedText type="smallBold" themeColor="textSecondary" style={styles.phaseTitle}>
                {phase.title.toUpperCase()}
              </ThemedText>
              
              <ThemedView type="backgroundElement" style={styles.tasksBox}>
                {phase.tasks.map((task) => (
                  <Pressable
                    key={task.id}
                    onPress={() => toggleTask(task.id)}
                    style={({ pressed }) => [styles.taskRow, pressed && styles.pressed]}>
                    <SymbolView
                      name={
                        task.completed
                          ? { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }
                          : { ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }
                      }
                      size={20}
                      tintColor={task.completed ? '#34C759' : theme.textSecondary}
                    />
                    <ThemedText
                      type="small"
                      style={[
                        styles.taskText,
                        task.completed && { textDecorationLine: 'line-through', opacity: 0.6 }
                      ]}>
                      {task.text}
                    </ThemedText>
                  </Pressable>
                ))}
              </ThemedView>
            </View>
          ))}
        </View>

        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.three,
  },
  header: {
    paddingVertical: Spacing.three,
    gap: Spacing.one,
  },
  headerTitle: {
    fontWeight: '800',
  },
  headerSubtitle: {
    lineHeight: 20,
  },
  progressCard: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: Spacing.one,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressMeta: {
    marginTop: Spacing.one,
  },
  phasesContainer: {
    gap: Spacing.four,
  },
  phaseWrapper: {
    gap: Spacing.two,
  },
  phaseTitle: {
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: Spacing.one,
  },
  tasksBox: {
    borderRadius: Spacing.three,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  taskText: {
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.7,
  },
});
