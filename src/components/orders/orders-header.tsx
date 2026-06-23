import React from 'react';
import { Pressable, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import tw from 'twrnc';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

interface OrdersHeaderProps {
  onBackPress: () => void;
  onFilterPress?: () => void;
}

export function OrdersHeader({ onBackPress, onFilterPress }: OrdersHeaderProps) {
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
        Orders
      </ThemedText>

      <Pressable
        onPress={onFilterPress}
        style={({ pressed }) => [
          tw`w-10 h-10 items-center justify-center rounded-full bg-[#121212] border border-[rgba(255,255,255,0.08)]`,
          pressed && tw`opacity-70`,
        ]}
      >
        <SymbolView
          name={{ ios: 'line.3.horizontal.decrease.circle', android: 'filter_list', web: 'filter_list' }}
          size={18}
          tintColor={theme.text}
        />
      </Pressable>
    </View>
  );
}
