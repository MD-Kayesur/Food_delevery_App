import { ThemedText } from '@/components/themed-text';
import { SymbolView } from 'expo-symbols';
import { Image, Pressable, View } from 'react-native';
import tw from 'twrnc';

interface HeaderSectionProps {
  isOnline: boolean;
  onToggleOnline: () => void;
  primaryOrange?: string;
}

export function HeaderSection({
  isOnline,
  onToggleOnline,
  primaryOrange = '#FF6C00',
}: HeaderSectionProps) {
  return (
    <View style={tw`flex-row items-center justify-between py-4`}>
      <View style={tw`flex-row items-center gap-3`}>
        <Image
          source={require('@/assets/Frame 2147228939.png')}
          style={tw`w-12 h-12 rounded-full border border-neutral-800`}
        />
        <View>
          <ThemedText style={tw`text-white text-lg font-bold`}>Alex Rider</ThemedText>
          <View style={tw`flex-row items-center gap-1 mt-0.5`}>
            <SymbolView
              name={{ ios: 'mappin.and.ellipse', android: 'location_on', web: 'location_on' }}
              size={12}
              tintColor={primaryOrange}
            />
            <ThemedText style={tw`text-neutral-400 text-xs`}>Downtown</ThemedText>
          </View>
        </View>
      </View>

      <View style={tw`flex-row items-center gap-2.5`}>
        {/* Custom Online Status Toggle */}
        <Pressable
          onPress={onToggleOnline}
          style={tw`flex-row items-center gap-2 bg-[#161618] rounded-full px-3 py-1.5 border border-neutral-800`}
        >
          <ThemedText style={tw`text-white text-xs font-semibold`}>
            {isOnline ? 'Online' : 'Offline'}
          </ThemedText>
          <View
            style={[
              tw`w-8 h-4.5 rounded-full p-0.5 justify-center`,
              { backgroundColor: isOnline ? primaryOrange : '#444444' },
            ]}
          >
            <View
              style={[
                tw`w-3.5 h-3.5 rounded-full bg-white shadow-sm`,
                { transform: [{ translateX: isOnline ? 14 : 0 }] },
              ]}
            />
          </View>
        </Pressable>

        {/* Bell Icon Button */}
        <Pressable style={tw`w-10 h-10 rounded-full bg-[#161618] items-center justify-center border border-neutral-800`}>
          <SymbolView
            name={{ ios: 'bell.fill', android: 'notifications', web: 'notifications' }}
            size={18}
            tintColor="#ffffff"
          />
        </Pressable>
      </View>
    </View>
  );
}
