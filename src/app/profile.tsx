import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { useRouter } from 'expo-router';
import tw from 'twrnc';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ProfileScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();
  const scheme = useColorScheme();
  const router = useRouter();

  const isDark = scheme === 'dark';

  // State to manage sub-views: 'settings' or 'change-password'
  const [view, setView] = useState<'settings' | 'change-password'>('settings');

  // Input states for Change Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Updating password state
  const [isUpdating, setIsUpdating] = useState(false);

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    ios: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.four,
      paddingBottom: Spacing.four,
    },
  });

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleBackPress = () => {
    if (view === 'change-password') {
      setView('settings');
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showAlert('Error', 'All fields are required.');
      return;
    }
    if (newPassword.length < 6) {
      showAlert('Error', 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert('Error', 'New passwords do not match.');
      return;
    }

    setIsUpdating(true);
    try {
      // Simulate API network call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showAlert('Success', 'Password updated successfully!');
      // Clear inputs and go back to settings
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setView('settings');
    } catch (e) {
      showAlert('Error', 'Failed to update password. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Are you sure you want to log out?');
      if (confirmLogout) {
        DeviceEventEmitter.emit('logout');
      }
    } else {
      Alert.alert(
        'Log Out',
        'Are you sure you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Log Out',
            style: 'destructive',
            onPress: () => {
              DeviceEventEmitter.emit('logout');
            },
          },
        ]
      );
    }
  };

  const handleDeleteAccount = () => {
    if (Platform.OS === 'web') {
      const confirmDelete = window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.');
      if (confirmDelete) {
        DeviceEventEmitter.emit('logout');
      }
    } else {
      Alert.alert(
        'Delete Account',
        'Are you sure you want to permanently delete your account? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete Account',
            style: 'destructive',
            onPress: () => {
              DeviceEventEmitter.emit('logout');
            },
          },
        ]
      );
    }
  };

  return (
    <ScrollView
      style={[tw`flex-1`, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[tw`flex-row justify-center`, contentPlatformStyle]}
      showsVerticalScrollIndicator={false}
    >
      <ThemedView style={tw`max-w-[800px] flex-grow px-5 py-2 gap-4 bg-transparent`}>
        {/* Custom Premium Header */}
        <View style={tw`flex-row items-center justify-between py-4`}>
          <Pressable
            onPress={handleBackPress}
            style={({ pressed }) => [
              tw`w-10 h-10 items-center justify-center rounded-full bg-[#121212] border border-[rgba(255,255,255,0.08)]`,
              pressed && tw`opacity-70`,
            ]}
          >
            <SymbolView
              name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
              size={18}
              tintColor={theme.text}
            />
          </Pressable>

          <ThemedText style={tw`text-lg font-bold text-center flex-1 text-white`}>
            Account Setting
          </ThemedText>

          <View style={tw`relative`}>
            <Pressable
              style={({ pressed }) => [
                tw`w-10 h-10 items-center justify-center rounded-full bg-[#121212] border border-[rgba(255,255,255,0.08)]`,
                pressed && tw`opacity-70`,
              ]}
            >
              <SymbolView
                name={{ ios: 'bell.fill', android: 'notifications', web: 'notifications' }}
                size={18}
                tintColor="#FF6C00"
              />
            </Pressable>
            {/* Notification Badge Dot */}
            <View style={tw`absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6C00] rounded-full border border-black`} />
          </View>
        </View>

        {view === 'settings' ? (
          /* Main Settings List */
          <View style={tw`gap-4 mt-4`}>
            {/* Change Password Row */}
            <Pressable
              onPress={() => setView('change-password')}
              style={({ pressed }) => [
                tw`flex-row items-center justify-between p-4 rounded-xl border bg-[#0C0C0E]`,
                { borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' },
                pressed && tw`opacity-80 scale-[0.99]`,
              ]}
            >
              <View style={tw`flex-row items-center`}>
                <View style={tw`w-10 h-10 items-center justify-center rounded-lg bg-[rgba(255,108,0,0.08)] border border-[rgba(255,108,0,0.15)] mr-4`}>
                  <SymbolView
                    name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }}
                    size={18}
                    tintColor="#FF6C00"
                  />
                </View>
                <ThemedText style={tw`text-white text-sm font-semibold`}>
                  Change Password
                </ThemedText>
              </View>
              <SymbolView
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                size={14}
                tintColor="#6E7175"
              />
            </Pressable>

            {/* Delete Account Row */}
            <Pressable
              onPress={handleDeleteAccount}
              style={({ pressed }) => [
                tw`flex-row items-center justify-between p-4 rounded-xl border bg-[#0C0C0E]`,
                { borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' },
                pressed && tw`opacity-80 scale-[0.99]`,
              ]}
            >
              <View style={tw`flex-row items-center`}>
                <View style={tw`w-10 h-10 items-center justify-center rounded-lg bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.15)] mr-4`}>
                  <SymbolView
                    name={{ ios: 'person.badge.minus.fill', android: 'person_remove', web: 'person_remove' }}
                    size={18}
                    tintColor="#EF4444"
                  />
                </View>
                <ThemedText style={tw`text-[#EF4444] text-sm font-semibold`}>
                  Delete Account
                </ThemedText>
              </View>
              <SymbolView
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                size={14}
                tintColor="#6E7175"
              />
            </Pressable>

            {/* Log Out Row */}
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                tw`flex-row items-center justify-between p-4 rounded-xl border bg-[#0C0C0E]`,
                { borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' },
                pressed && tw`opacity-80 scale-[0.99]`,
              ]}
            >
              <View style={tw`flex-row items-center`}>
                <View style={tw`w-10 h-10 items-center justify-center rounded-lg bg-[rgba(255,108,0,0.08)] border border-[rgba(255,108,0,0.15)] mr-4`}>
                  <SymbolView
                    name={{ ios: 'rectangle.portrait.and.arrow.right.fill', android: 'logout', web: 'logout' }}
                    size={18}
                    tintColor="#FF6C00"
                  />
                </View>
                <ThemedText style={tw`text-[#FF6C00] text-sm font-semibold`}>
                  Log Out
                </ThemedText>
              </View>
              <SymbolView
                name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                size={14}
                tintColor="#6E7175"
              />
            </Pressable>
          </View>
        ) : (
          /* Change Password Form View */
          <View style={tw`gap-5 mt-4`}>
            {/* Current Password Field */}
            <View style={tw`gap-2`}>
              <ThemedText style={tw`  font-semibold text-sm`}>
                Current Password
              </ThemedText>
              <View
                style={[
                  tw`bg-[#121212] border rounded-xl px-4 py-3.5 flex-row items-center justify-between`,
                  { borderColor: 'rgba(255, 255, 255, 0.08)' },
                ]}
              >
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#555555"
                  secureTextEntry={!showCurrentPassword}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  autoCapitalize="none"
                  style={[tw`flex-grow text-white text-sm p-0 mr-2`, { outlineStyle: 'none' } as any]}
                />
                <Pressable
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={tw`p-1`}
                >
                  <SymbolView
                    name={
                      showCurrentPassword
                        ? { ios: 'eye.fill', android: 'visibility', web: 'visibility' }
                        : { ios: 'eye.slash.fill', android: 'visibility_off', web: 'visibility_off' }
                    }
                    size={18}
                    tintColor="#6E7175"
                  />
                </Pressable>
              </View>
            </View>

            {/* New Password Field */}
            <View style={tw`gap-2`}>
              <ThemedText style={tw`  font-semibold text-sm`}>
                New Password
              </ThemedText>
              <View
                style={[
                  tw`bg-[#121212] border rounded-xl px-4 py-3.5 flex-row items-center justify-between`,
                  { borderColor: 'rgba(255, 255, 255, 0.08)' },
                ]}
              >
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#555555"
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  autoCapitalize="none"
                  style={[tw`flex-grow text-white text-sm p-0 mr-2`, { outlineStyle: 'none' } as any]}
                />
                <Pressable
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={tw`p-1`}
                >
                  <SymbolView
                    name={
                      showNewPassword
                        ? { ios: 'eye.fill', android: 'visibility', web: 'visibility' }
                        : { ios: 'eye.slash.fill', android: 'visibility_off', web: 'visibility_off' }
                    }
                    size={18}
                    tintColor="#6E7175"
                  />
                </Pressable>
              </View>
            </View>

            {/* Confirm Password Field */}
            <View style={tw`gap-2`}>
              <ThemedText style={tw`  font-semibold text-sm`}>
                New Confirm Password
              </ThemedText>
              <View
                style={[
                  tw`bg-[#121212] border rounded-xl px-4 py-3.5 flex-row items-center justify-between`,
                  { borderColor: 'rgba(255, 255, 255, 0.08)' },
                ]}
              >
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#555555"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                  style={[tw`flex-grow text-white text-sm p-0 mr-2`, { outlineStyle: 'none' } as any]}
                />
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={tw`p-1`}
                >
                  <SymbolView
                    name={
                      showConfirmPassword
                        ? { ios: 'eye.fill', android: 'visibility', web: 'visibility' }
                        : { ios: 'eye.slash.fill', android: 'visibility_off', web: 'visibility_off' }
                    }
                    size={18}
                    tintColor="#6E7175"
                  />
                </Pressable>
              </View>
            </View>

            {/* Update Button */}
            <Pressable
              onPress={handleUpdatePassword}
              disabled={isUpdating}
              style={({ pressed }) => [
                tw`w-full bg-[#FF6C00] py-4 rounded-full items-center justify-center shadow-lg mt-4`,
                (pressed || isUpdating) && tw`opacity-90 scale-[0.99]`,
              ]}
            >
              {isUpdating ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <ThemedText style={tw`text-white font-bold text-base`}>
                  Update
                </ThemedText>
              )}
            </Pressable>
          </View>
        )}

        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}
