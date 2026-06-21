import { ThemedText } from '@/components/themed-text';
import { Image, Pressable, View } from 'react-native';
import tw from 'twrnc';

interface UpcomingRequestData {
  id: string;
  category: string;
  earnings: string;
  deliveryTime: string;
  orderId: string;
  pickup: string;
  delivery: string;
  active: boolean;
}

interface UpcomingRequestsSectionProps {
  upcomingRequest: UpcomingRequestData | null;
  onAcceptTask: () => void;
  onDeclineTask: () => void;
}

export function UpcomingRequestsSection({
  upcomingRequest,
  onAcceptTask,
  onDeclineTask,
}: UpcomingRequestsSectionProps) {
  return (
    <View style={tw`mb-6`}>
      <View style={tw`flex-row justify-between items-center mb-3`}>
        <View style={tw`flex-row items-center gap-2`}>
          <ThemedText style={tw`text-white text-lg font-bold`}>Upcoming Requests</ThemedText>
          {upcomingRequest && (
            <View style={tw`bg-[#FF6C00] w-5 h-5 rounded-full items-center justify-center`}>
              <ThemedText style={tw`text-white text-xs font-bold`}>1</ThemedText>
            </View>
          )}
        </View>
        <Pressable>
          <ThemedText style={tw`text-[#FF6C00] text-xs font-bold`}>View All &gt;</ThemedText>
        </Pressable>
      </View>

      {upcomingRequest ? (
        <View style={tw`bg-[#121212] rounded-2xl p-4 border border-neutral-900`}>
          <View style={tw`flex-row gap-4`}>
            <Image
              source={require('@/assets/food1.png')}
              style={tw`w-20 h-20 rounded-xl`}
              resizeMode="cover"
            />
            <View style={tw`flex-1`}>
              <View style={tw`flex-row justify-between items-start`}>
                <View style={tw`border border-green-600/40 bg-green-950/20 px-2 py-0.5 rounded-md`}>
                  <ThemedText style={tw`text-green-500 text-[10px] font-bold`}>
                    {upcomingRequest.category}
                  </ThemedText>
                </View>
                <ThemedText style={tw`text-white font-bold text-base`}>
                  {upcomingRequest.earnings}
                </ThemedText>
              </View>

              <ThemedText style={tw`text-[#FF6C00] text-xs mt-2 font-semibold`}>
                {upcomingRequest.deliveryTime}
              </ThemedText>
              <ThemedText style={tw`text-neutral-500 text-[10px] mt-0.5`}>
                Order #{upcomingRequest.orderId}
              </ThemedText>
            </View>
          </View>

          {/* Locations */}
          <View style={tw`mt-4 pt-4 border-t border-neutral-850/60 gap-3`}>
            <View style={tw`flex-row items-start gap-2.5`}>
              <View style={tw`w-2 h-2 rounded-full bg-[#FF6C00] mt-1.5`} />
              <View style={tw`flex-1`}>
                <ThemedText style={tw`text-neutral-400 text-[10px] font-semibold`}>Pickup Location</ThemedText>
                <ThemedText style={tw`text-white text-xs mt-0.5`}>{upcomingRequest.pickup}</ThemedText>
              </View>
            </View>
            <View style={tw`flex-row items-start gap-2.5`}>
              <View style={tw`w-2 h-2 rounded-full bg-red-600 mt-1.5`} />
              <View style={tw`flex-1`}>
                <ThemedText style={tw`text-neutral-400 text-[10px] font-semibold`}>Delivery Location</ThemedText>
                <ThemedText style={tw`text-white text-xs mt-0.5`}>{upcomingRequest.delivery}</ThemedText>
              </View>
            </View>
          </View>

          {/* Accept / Decline Action Buttons */}
          <View style={tw`flex-row gap-3 mt-5`}>
            <Pressable
              onPress={onAcceptTask}
              style={({ pressed }) => [
                tw`flex-1 bg-[#FF6C00] py-3 rounded-full items-center justify-center shadow-lg`,
                pressed && tw`opacity-90`,
              ]}
            >
              <ThemedText style={tw`text-white font-bold text-sm`}>Accept Task</ThemedText>
            </Pressable>
            <Pressable
              onPress={onDeclineTask}
              style={({ pressed }) => [
                tw`flex-1 bg-[#161618] py-3 rounded-full items-center justify-center border border-neutral-800`,
                pressed && tw`opacity-80`,
              ]}
            >
              <ThemedText style={tw`text-white font-bold text-sm`}>Decline</ThemedText>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={tw`bg-[#121212] rounded-2xl p-5 border border-neutral-900 items-center justify-center`}>
          <ThemedText style={tw`text-neutral-500 text-xs`}>No upcoming requests available.</ThemedText>
        </View>
      )}
    </View>
  );
}
