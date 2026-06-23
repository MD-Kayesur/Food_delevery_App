import React from 'react';
import { View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import tw from 'twrnc';

import { ThemedText } from '@/components/themed-text';

export interface AreaData {
  id: string;
  name: string;
  distance: string;
  demand: 'high' | 'medium' | 'low';
  demandLabel: string;
  description: string;
}

interface NearbyAreaCardProps {
  area: AreaData;
}

export function NearbyAreaCard({ area }: NearbyAreaCardProps) {
  const getDemandColor = (demand: 'high' | 'medium' | 'low') => {
    switch (demand) {
      case 'high':
        return '#22C55E';
      case 'medium':
        return '#FF6C00';
      case 'low':
        return '#8E9195';
    }
  };

  return (
    <View
      style={tw`flex-row items-center justify-between p-4 bg-[#121212] rounded-xl border border-neutral-900 mb-3`}
    >
      <View style={tw`flex-row items-center gap-3.5 flex-1`}>
        <SymbolView
          name={{ ios: 'mappin.circle.fill', android: 'location_on', web: 'location_on' }}
          size={22}
          tintColor="#FF6C00"
        />
        <View style={tw`flex-1`}>
          <ThemedText style={tw`text-white font-bold text-sm`}>
            {area.name}
          </ThemedText>
          <ThemedText style={tw`text-neutral-500 text-xs mt-0.5`}>
            {area.distance}
          </ThemedText>
        </View>
      </View>

      <View style={tw`items-end gap-1.5`}>
        <ThemedText
          style={[
            tw`text-xs font-bold`,
            { color: getDemandColor(area.demand) },
          ]}
        >
          {area.demandLabel}
        </ThemedText>
        <ThemedText style={tw`text-neutral-500 text-[10px]`}>
          {area.description}
        </ThemedText>
      </View>
    </View>
  );
}
