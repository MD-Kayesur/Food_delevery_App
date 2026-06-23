import React from 'react';
import { ScrollView, Pressable } from 'react-native';
import tw from 'twrnc';

import { ThemedText } from '@/components/themed-text';

export type DemandType = 'all' | 'high' | 'medium' | 'low';

interface NearbyFilterTabsProps {
  activeTab: DemandType;
  setActiveTab: (tab: DemandType) => void;
}

export function NearbyFilterTabs({ activeTab, setActiveTab }: NearbyFilterTabsProps) {
  const tabs: { id: DemandType; label: string }[] = [
    { id: 'all', label: 'All Areas' },
    { id: 'high', label: 'High Demand' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low Demand' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={tw`max-h-12 mb-4`}
      contentContainerStyle={tw`flex-row gap-2.5 items-center`}
    >
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[
              tw`py-2 px-4 rounded-lg border`,
              {
                backgroundColor: isSelected ? 'rgba(255, 108, 0, 0.08)' : '#121212',
                borderColor: isSelected ? '#FF6C00' : 'rgba(255, 255, 255, 0.08)',
              },
            ]}
          >
            <ThemedText
              style={[
                tw`text-xs font-bold`,
                { color: isSelected ? '#FF6C00' : '#8E9195' },
              ]}
            >
              {tab.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
