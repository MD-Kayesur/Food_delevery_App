import React from 'react';
import { Pressable, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import tw from 'twrnc';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

interface LocationHeaderProps {
  onBackPress: () => void;
  onNotificationsPress?: () => void;
}

export function LocationHeader({ onBackPress, onNotificationsPress }: LocationHeaderProps) {
  const theme = useTheme();

  return (
    <View style={tw`flex-row items-center justify-between py-4`}>
      <Pressable
        onPress={onBackPress}
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
        Location
      </ThemedText>

      <View style={tw`relative`}>
        <Pressable
          onPress={onNotificationsPress}
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
        <View style={tw`absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6C00] rounded-full border border-black`} />
      </View>
    </View>
  );
}
