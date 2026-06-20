import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

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
      style={[tw`flex-1`, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[tw`flex-row justify-center`, contentPlatformStyle]}>
      <ThemedView style={tw`max-w-[800px] flex-grow px-6 py-6 gap-4`}>
        
        {/* Developer Profile Card */}
        <ThemedView type="backgroundElement" style={tw`p-6 rounded-2xl items-center gap-2 mt-2`}>
          <ThemedView style={tw`mb-1`}>
            <SymbolView
              name={{ ios: 'person.crop.circle.fill', android: 'account_circle', web: 'person' }}
              size={64}
              tintColor={theme.text}
            />
          </ThemedView>
          <ThemedText type="subtitle" style={tw`font-bold`}>MD-Kayesur</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={tw`-mt-1 font-semibold`}>
            Lead Mobile & Web Developer
          </ThemedText>
          <ThemedText style={tw`text-center text-sm leading-5 mt-2`} themeColor="textSecondary">
            Building high-performance universal applications using React Native, Expo, and modern backends.
          </ThemedText>
        </ThemedView>

        {/* Project Links */}
        <ThemedView style={tw`mt-6 px-2`}>
          <ThemedText type="smallBold" themeColor="textSecondary">PROJECT LINKS</ThemedText>
        </ThemedView>

        <ThemedView style={tw`gap-2`}>
          <ExternalLink href="https://github.com/MD-Kayesur" asChild>
            <Pressable style={({ pressed }) => [tw`w-full`, pressed && tw`opacity-70`]}>
              <ThemedView type="backgroundElement" style={tw`flex-row items-center gap-4 p-4 rounded-2xl`}>
                <SymbolView
                  name={{ ios: 'person.fill', android: 'person', web: 'person' }}
                  size={16}
                  tintColor={theme.text}
                />
                <ThemedText type="smallBold" style={tw`text-sm`}>GitHub Profile</ThemedText>
              </ThemedView>
            </Pressable>
          </ExternalLink>

          <ExternalLink href="https://github.com/MD-Kayesur/Food_delevery_App" asChild>
            <Pressable style={({ pressed }) => [tw`w-full`, pressed && tw`opacity-70`]}>
              <ThemedView type="backgroundElement" style={tw`flex-row items-center gap-4 p-4 rounded-2xl`}>
                <SymbolView
                  name={{ ios: 'folder.fill', android: 'folder', web: 'folder' }}
                  size={16}
                  tintColor={theme.text}
                />
                <ThemedText type="smallBold" style={tw`text-sm`}>App Repository</ThemedText>
              </ThemedView>
            </Pressable>
          </ExternalLink>

          <ExternalLink href="https://www.figma.com/design/iig3b1mWILbZRPyBOtaQBU/alipacno-%7C%7C-Custom-UI-U-design-%7C%7C-Bits-wise-%7C%7C-FO11BBB456F87--Copy-?node-id=1400-12221&m=dev" asChild>
            <Pressable style={({ pressed }) => [tw`w-full`, pressed && tw`opacity-70`]}>
              <ThemedView type="backgroundElement" style={tw`flex-row items-center gap-4 p-4 rounded-2xl`}>
                <SymbolView
                  name={{ ios: 'paintbrush.fill', android: 'palette', web: 'palette' }}
                  size={16}
                  tintColor={theme.text}
                />
                <ThemedText type="smallBold" style={tw`text-sm`}>Figma UI Designs</ThemedText>
              </ThemedView>
            </Pressable>
          </ExternalLink>
        </ThemedView>

        {/* Roadmap */}
        <ThemedView style={tw`mt-6 px-2`}>
          <ThemedText type="smallBold" themeColor="textSecondary">DEVELOPMENT ROADMAP</ThemedText>
        </ThemedView>

        <ThemedView style={tw`gap-4`}>
          <Collapsible title="Phase 1: Design System & Styling (Days 1 - 2)">
            <ThemedView style={tw`flex-row items-center gap-4 my-1 bg-transparent`}>
              <SymbolView name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check' }} size={16} tintColor="#34C759" />
              <ThemedText type="small" style={tw`flex-shrink-1`}>Day 1: Design system colors, tokens & global variables</ThemedText>
            </ThemedView>
            <ThemedView style={tw`flex-row items-center gap-4 my-1 bg-transparent`}>
              <SymbolView name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check' }} size={16} tintColor="#34C759" />
              <ThemedText type="small" style={tw`flex-shrink-1`}>Day 2: Core components (buttons, text fields, layouts)</ThemedText>
            </ThemedView>
          </Collapsible>

          <Collapsible title="Phase 2: Rider App Onboarding & Auth (Days 3 - 5)">
            <ThemedView style={tw`flex-row items-center gap-4 my-1 bg-transparent`}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={tw`flex-shrink-1`}>Day 3: Splash & Onboarding screens (1, 2, 3)</ThemedText>
            </ThemedView>
            <ThemedView style={tw`flex-row items-center gap-4 my-1 bg-transparent`}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={tw`flex-shrink-1`}>Day 4: Credentials Login & OTP Verification screen</ThemedText>
            </ThemedView>
            <ThemedView style={tw`flex-row items-center gap-4 my-1 bg-transparent`}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={tw`flex-shrink-1`}>Day 5: Password Recovery Flow (Forgot/Reset)</ThemedText>
            </ThemedView>
          </Collapsible>

          <Collapsible title="Phase 3: Rider App Core & Maps (Days 6 - 9)">
            <ThemedView style={tw`flex-row items-center gap-4 my-1 bg-transparent`}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={tw`flex-shrink-1`}>Day 6: Main Home Screen & Earnings Dashboard</ThemedText>
            </ThemedView>
            <ThemedView style={tw`flex-row items-center gap-4 my-1 bg-transparent`}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={tw`flex-shrink-1`}>Day 7: Orders Details Sheet & Live Map Routing</ThemedText>
            </ThemedView>
            <ThemedView style={tw`flex-row items-center gap-4 my-1 bg-transparent`}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={tw`flex-shrink-1`}>Day 8: Shift Planner & Scheduler Calendar</ThemedText>
            </ThemedView>
            <ThemedView style={tw`flex-row items-center gap-4 my-1 bg-transparent`}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={tw`flex-shrink-1`}>Day 9: Support Tickets & Order Chat Rooms</ThemedText>
            </ThemedView>
          </Collapsible>

          <Collapsible title="Phase 4: Rider Profile & Settings (Days 10 - 11)">
            <ThemedView style={tw`flex-row items-center gap-4 my-1 bg-transparent`}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={tw`flex-shrink-1`}>Day 10: Profile view, stats & edit credentials</ThemedText>
            </ThemedView>
            <ThemedView style={tw`flex-row items-center gap-4 my-1 bg-transparent`}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={tw`flex-shrink-1`}>Day 11: T&C, FAQ Collapsible, Notifications</ThemedText>
            </ThemedView>
          </Collapsible>

          <Collapsible title="Phase 5: Admin Panel Layout & CRM (Days 12 - 14)">
            <ThemedView style={tw`flex-row items-center gap-4 my-1 bg-transparent`}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={tw`flex-shrink-1`}>Day 12: Collapsible Sidebar & Statistics Cards</ThemedText>
            </ThemedView>
            <ThemedView style={tw`flex-row items-center gap-4 my-1 bg-transparent`}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={tw`flex-shrink-1`}>Day 13: Customer Relations, Add Users, Matrix</ThemedText>
            </ThemedView>
            <ThemedView style={tw`flex-row items-center gap-4 my-1 bg-transparent`}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={tw`flex-shrink-1`}>Day 14: Drivers Status Page & Dispatch Controller</ThemedText>
            </ThemedView>
          </Collapsible>

          <Collapsible title="Phase 6: Admin Menu & Inventory (Days 15 - 18)">
            <ThemedView style={tw`flex-row items-center gap-4 my-1 bg-transparent`}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={tw`flex-shrink-1`}>Day 15: Menu categories, pricing & stock counts</ThemedText>
            </ThemedView>
            <ThemedView style={tw`flex-row items-center gap-4 my-1 bg-transparent`}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={tw`flex-shrink-1`}>Day 16: Marketing Coupon manager & Push banners</ThemedText>
            </ThemedView>
            <ThemedView style={tw`flex-row items-center gap-4 my-1 bg-transparent`}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={tw`flex-shrink-1`}>Day 17: Call Logs metadata & Admin central chat terminal</ThemedText>
            </ThemedView>
            <ThemedView style={tw`flex-row items-center gap-4 my-1 bg-transparent`}>
              <SymbolView name={{ ios: 'circle', android: 'radio_button_unchecked', web: 'circle' }} size={16} tintColor={theme.textSecondary} />
              <ThemedText type="small" style={tw`flex-shrink-1`}>Day 18: System settings & reviews tracker</ThemedText>
            </ThemedView>
          </Collapsible>
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}
