import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ProfileScreen() {
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

  const settingsOptions = [
    {
      id: 'account',
      title: 'Account Settings',
      subtitle: 'Manage your profile information and credentials',
      icon: { ios: 'person.fill', android: 'person', web: 'person' },
    },
    {
      id: 'notifications',
      title: 'Notification Preferences',
      subtitle: 'Customize push notifications and alerts',
      icon: { ios: 'bell.fill', android: 'notifications', web: 'notifications' },
    },
    {
      id: 'payment',
      title: 'Saved Payments',
      subtitle: 'Manage credit cards and payment gateways',
      icon: { ios: 'creditcard.fill', android: 'payment', web: 'payment' },
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Two-factor auth and active sessions management',
      icon: { ios: 'lock.fill', android: 'lock', web: 'lock' },
    },
    {
      id: 'support',
      title: 'Support Desk',
      subtitle: 'Open support tickets or chat with an agent',
      icon: { ios: 'phone.fill', android: 'support', web: 'phone' },
    },
  ];

  return (
    <ScrollView
      style={[tw`flex-1`, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[tw`flex-row justify-center`, contentPlatformStyle]}
    >
      <ThemedView style={tw`max-w-[800px] flex-grow px-6 py-6 gap-4`}>
        {/* User Card */}
        <ThemedView type="backgroundElement" style={tw`p-6 rounded-2xl items-center gap-1 mt-2`}>
          <View style={tw`mb-1`}>
            <SymbolView
              name={{ ios: 'person.crop.circle.fill', android: 'account_circle', web: 'person' }}
              size={72}
              tintColor={theme.text}
            />
          </View>
          <ThemedText type="subtitle" style={tw`font-bold`}>
            John Doe
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={tw`-mt-1 font-semibold`}>
            johndoe@deliveryapp.com
          </ThemedText>
        </ThemedView>

        {/* Settings Grid */}
        <ThemedView style={tw`mt-4 px-2`}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            SETTINGS & OPTIONS
          </ThemedText>
        </ThemedView>

        <View style={tw`gap-2`}>
          {settingsOptions.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                tw`flex-row items-center p-4 rounded-lg gap-4`,
                { backgroundColor: theme.backgroundElement },
                pressed && tw`opacity-70`,
              ]}
            >
              <View style={tw`w-9 h-9 rounded-full items-center justify-center`}>
                <SymbolView name={item.icon as any} size={20} tintColor="#FF6C00" />
              </View>
              <View style={tw`flex-1`}>
                <ThemedText type="smallBold">{item.title}</ThemedText>
                <ThemedText type="code" themeColor="textSecondary" style={tw`text-[11px] mt-0.5`}>
                  {item.subtitle}
                </ThemedText>
              </View>
              <SymbolView
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                size={16}
                tintColor={theme.textSecondary}
              />
            </Pressable>
          ))}
        </View>

        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}
