import { ThemedText } from '@/components/themed-text';
import { SymbolView } from 'expo-symbols';
import { Pressable, View } from 'react-native';
import tw from 'twrnc';

interface HistoryItem {
  id: string;
  orderNo: string;
  earnings: string;
}

interface RecentHistorySectionProps {
  recentHistory: HistoryItem[];
  primaryOrange?: string;
}

export function RecentHistorySection({
  recentHistory,
  primaryOrange = '#FF6C00',
}: RecentHistorySectionProps) {
  return (
    <View>
      <View style={tw`flex-row justify-between items-center mb-3`}>
        <ThemedText style={tw`text-white text-lg font-bold`}>Recent History</ThemedText>
        <Pressable>
          <ThemedText style={tw`text-[#FF6C00] text-xs font-bold`}>View All &gt;</ThemedText>
        </Pressable>
      </View>

      <View style={tw`gap-2.5`}>
        {recentHistory.map((item, idx) => (
          <View
            key={idx}
            style={tw`flex-row items-center justify-between bg-[#121212] rounded-xl p-3 border border-neutral-900`}
          >
            <View style={tw`flex-row items-center gap-3`}>
              <View style={tw`w-7 h-7 rounded-full bg-neutral-800 items-center justify-center`}>
                <SymbolView
                  name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
                  size={14}
                  tintColor={primaryOrange}
                />
              </View>
              <View>
                <ThemedText style={tw`text-white text-sm font-bold`}>{item.id}</ThemedText>
                <ThemedText style={tw`text-neutral-500 text-[10px] mt-0.5`}>{item.orderNo}</ThemedText>
              </View>
            </View>
            <ThemedText style={tw`text-white font-bold text-sm`}>{item.earnings}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}
