import React from 'react';
import { ScrollView, Pressable, View } from 'react-native';
import tw from 'twrnc';

import { ThemedText } from '@/components/themed-text';

export type TabType = 'all' | 'upcoming' | 'ongoing' | 'completed';

interface OrdersFilterTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  counts: Record<TabType, number>;
}

export function OrdersFilterTabs({ activeTab, setActiveTab, counts }: OrdersFilterTabsProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={tw`max-h-12 mb-4`}
      contentContainerStyle={tw`flex-row gap-3 items-center`}
    >
      {tabs.map((tab) => {
        const isSelected = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[
              tw`flex-row items-center py-2 px-4 rounded-full border`,
              {
                backgroundColor: isSelected ? '#FFFFFF' : '#121212',
                borderColor: isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.08)',
              },
            ]}
          >
            <ThemedText
              style={[
                tw`text-sm font-bold mr-1.5`,
                { color: isSelected ? '#000000' : '#8E9195' },
              ]}
            >
              {tab.label}
            </ThemedText>
            <View
              style={tw`bg-[#FF6C00] px-1.5 py-0.5 rounded-full min-w-5 items-center justify-center`}
            >
              <ThemedText style={tw`text-white text-[10px] font-extrabold`}>
                {counts[tab.id]}
              </ThemedText>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
