import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function TabTwoScreen() {
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

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        
        {/* Developer Profile Card */}
        <ThemedView type="backgroundElement" style={styles.profileCard}>
          <ThemedView style={styles.avatarContainer}>
            <SymbolView
              name={{ ios: 'person.crop.circle.fill', android: 'account_circle', web: 'person' }}
              size={64}
              tintColor={theme.text}
            />
          </ThemedView>
          <ThemedText type="subtitle" style={styles.profileName}>MD-Kayesur</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.profileRole}>
            Lead Mobile & Web Developer
          </ThemedText>
          <ThemedText style={styles.profileBio} themeColor="textSecondary">
            Building high-performance universal applications using React Native, Expo, and modern backends.
          </ThemedText>
        </ThemedView>

        {/* Project Links */}
        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="smallBold" themeColor="textSecondary">PROJECT LINKS</ThemedText>
        </ThemedView>

        <ThemedView style={styles.linksContainer}>
          <ExternalLink href="https://github.com/MD-Kayesur" asChild>
            <Pressable style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}>
              <ThemedView type="backgroundElement" style={styles.linkButtonInner}>
                <SymbolView
                  name={{ ios: 'person.fill', android: 'person', web: 'person' }}
                  size={16}
                  tintColor={theme.text}
                />
                <ThemedText type="smallBold" style={styles.linkText}>GitHub Profile</ThemedText>
              </ThemedView>
            </Pressable>
          </ExternalLink>

          <ExternalLink href="https://github.com/MD-Kayesur/Food_delevery_App" asChild>
            <Pressable style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}>
              <ThemedView type="backgroundElement" style={styles.linkButtonInner}>
                <SymbolView
                  name={{ ios: 'folder.fill', android: 'folder', web: 'folder' }}
                  size={16}
                  tintColor={theme.text}
                />
                <ThemedText type="smallBold" style={styles.linkText}>App Repository</ThemedText>
              </ThemedView>
            </Pressable>
          </ExternalLink>

          <ExternalLink href="https://www.figma.com/design/iig3b1mWILbZRPyBOtaQBU/alipacno-%7C%7C-Custom-UI-U-design-%7C%7C-Bits-wise-%7C%7C-FO11BBB456F87--Copy-?node-id=1400-12221&m=dev" asChild>
            <Pressable style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}>
              <ThemedView type="backgroundElement" style={styles.linkButtonInner}>
                <SymbolView
                  name={{ ios: 'paintbrush.fill', android: 'palette', web: 'palette' }}
                  size={16}
                  tintColor={theme.text}
                />
                <ThemedText type="smallBold" style={styles.linkText}>Figma UI Designs</ThemedText>
              </ThemedView>
            </Pressable>
          </ExternalLink>
        </ThemedView>

        {/* Roadmap */}
        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="smallBold" themeColor="textSecondary">DEVELOPMENT ROADMAP</ThemedText>
        </ThemedView>

        <ThemedView style={styles.sectionsWrapper}>
          <Collapsible title="Phase 1: Design System & Styling (Days 1 - 2)">
            <ThemedView style={styles.taskItem}>
              <SymbolView name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check' }} size={16} tintColor="#34C759" />
              <ThemedText type="small" style={styles.taskText}>Day 1: Design system colors, tokens & global variables</ThemedText>
            </ThemedView>
            <ThemedView style={styles.taskItem}>
              <SymbolView name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check' }} size={16} tintColor="#34C759" />
              <ThemedText type="small" style={styles.taskText}>Day 2: Core components (buttons, text fields, layouts)</ThemedText>
            </ThemedView>
          </Collapsible>

          <Collapsible title="Phase 2: Rider App Onboarding & Auth (Days 3 - 5)">
            <ThemedView style={styles.taskItem}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={styles.taskText}>Day 3: Splash & Onboarding screens (1, 2, 3)</ThemedText>
            </ThemedView>
            <ThemedView style={styles.taskItem}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={styles.taskText}>Day 4: Credentials Login & OTP Verification screen</ThemedText>
            </ThemedView>
            <ThemedView style={styles.taskItem}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={styles.taskText}>Day 5: Password Recovery Flow (Forgot/Reset)</ThemedText>
            </ThemedView>
          </Collapsible>

          <Collapsible title="Phase 3: Rider App Core & Maps (Days 6 - 9)">
            <ThemedView style={styles.taskItem}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={styles.taskText}>Day 6: Main Home Screen & Earnings Dashboard</ThemedText>
            </ThemedView>
            <ThemedView style={styles.taskItem}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={styles.taskText}>Day 7: Orders Details Sheet & Live Map Routing</ThemedText>
            </ThemedView>
            <ThemedView style={styles.taskItem}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={styles.taskText}>Day 8: Shift Planner & Scheduler Calendar</ThemedText>
            </ThemedView>
            <ThemedView style={styles.taskItem}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={styles.taskText}>Day 9: Support Tickets & Order Chat Rooms</ThemedText>
            </ThemedView>
          </Collapsible>

          <Collapsible title="Phase 4: Rider Profile & Settings (Days 10 - 11)">
            <ThemedView style={styles.taskItem}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={styles.taskText}>Day 10: Profile view, stats & edit credentials</ThemedText>
            </ThemedView>
            <ThemedView style={styles.taskItem}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={styles.taskText}>Day 11: T&C, FAQ Collapsible, Notifications</ThemedText>
            </ThemedView>
          </Collapsible>

          <Collapsible title="Phase 5: Admin Panel Layout & CRM (Days 12 - 14)">
            <ThemedView style={styles.taskItem}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={styles.taskText}>Day 12: Collapsible Sidebar & Statistics Cards</ThemedText>
            </ThemedView>
            <ThemedView style={styles.taskItem}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={styles.taskText}>Day 13: Customer Relations, Add Users, Matrix</ThemedText>
            </ThemedView>
            <ThemedView style={styles.taskItem}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={styles.taskText}>Day 14: Drivers Status Page & Dispatch Controller</ThemedText>
            </ThemedView>
          </Collapsible>

          <Collapsible title="Phase 6: Admin Menu & Inventory (Days 15 - 18)">
            <ThemedView style={styles.taskItem}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={styles.taskText}>Day 15: Menu categories, pricing & stock counts</ThemedText>
            </ThemedView>
            <ThemedView style={styles.taskItem}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={styles.taskText}>Day 16: Marketing Coupon manager & Push banners</ThemedText>
            </ThemedView>
            <ThemedView style={styles.taskItem}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={styles.taskText}>Day 17: Call Logs metadata & Admin chat terminal</ThemedText>
            </ThemedView>
            <ThemedView style={styles.taskItem}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={styles.taskText}>Day 18: System settings & reviews tracker</ThemedText>
            </ThemedView>
          </Collapsible>
        </ThemedView>

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
  profileCard: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  avatarContainer: {
    marginBottom: Spacing.one,
  },
  profileName: {
    fontWeight: '700',
  },
  profileRole: {
    marginTop: -Spacing.one,
    fontWeight: '600',
  },
  profileBio: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    marginTop: Spacing.one,
  },
  sectionHeader: {
    marginTop: Spacing.four,
    paddingHorizontal: Spacing.two,
  },
  linksContainer: {
    gap: Spacing.two,
  },
  linkButton: {
    width: '100%',
  },
  linkButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  linkText: {
    fontSize: 14,
  },
  pressed: {
    opacity: 0.7,
  },
  sectionsWrapper: {
    gap: Spacing.three,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginVertical: Spacing.one,
    backgroundColor: 'transparent',
  },
  taskText: {
    flexShrink: 1,
  },
});

