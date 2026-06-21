import { ThemedText } from '@/components/themed-text';
import { SymbolView } from 'expo-symbols';
import { View } from 'react-native';
import tw from 'twrnc';

interface StatsContainerProps {
  todayEarnings: number;
  todayDeliveries: number;
  primaryOrange?: string;
}

export function StatsContainer({
  todayEarnings,
  todayDeliveries,
  primaryOrange = '#FF6C00',
}: StatsContainerProps) {
  return (
    <View style={tw`flex-row justify-between bg-[#121212] rounded-2xl p-4 mt-2 mb-6 border border-neutral-900`}>
      <View style={tw`flex-row items-center gap-3`}>
        <View style={tw`w-9 h-9 rounded-xl bg-neutral-800 items-center justify-center`}>
          <SymbolView
            name={{ ios: 'banknote', android: 'account_balance_wallet', web: 'account_balance_wallet' }}
            size={18}
            tintColor={primaryOrange}
          />
        </View>
        <View>
          <ThemedText style={tw`text-neutral-400 text-xs`}>Today's Earnings</ThemedText>
          <ThemedText style={tw`text-white text-base font-bold mt-0.5`}>
            £{todayEarnings.toFixed(2)}
          </ThemedText>
        </View>
      </View>

      <View style={tw`w-[1px] bg-neutral-800 self-stretch`} />

      <View style={tw`flex-row items-center gap-3`}>
        <View style={tw`w-9 h-9 rounded-xl bg-neutral-800 items-center justify-center`}>
          <SymbolView
            name={{ ios: 'paperplane.fill', android: 'navigation', web: 'navigation' }}
            size={18}
            tintColor={primaryOrange}
          />
        </View>
        <View>
          <ThemedText style={tw`text-neutral-400 text-xs`}>Deliveries</ThemedText>
          <ThemedText style={tw`text-white text-base font-bold mt-0.5`}>
            {todayDeliveries}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}
