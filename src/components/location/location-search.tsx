import React from 'react';
import { View, TextInput } from 'react-native';
import { SymbolView } from 'expo-symbols';
import tw from 'twrnc';

interface LocationSearchProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function LocationSearch({ value, onChangeText }: LocationSearchProps) {
  return (
    <View
      style={[
        tw`flex-row items-center bg-[#121212] px-4 py-3 rounded-xl border`,
        { borderColor: '#FF6C00' },
      ]}
    >
      <SymbolView
        name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
        size={18}
        tintColor="#FF6C00"
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search location......"
        placeholderTextColor="#8E9195"
        style={tw`flex-grow text-white text-sm mx-3 py-0.5`}
      />

      <SymbolView
        name={{ ios: 'slider.horizontal.3', android: 'tune', web: 'tune' }}
        size={18}
        tintColor="#8E9195"
      />
    </View>
  );
}
