import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import tw from 'twrnc';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export interface OrderData {
  id: string;
  category: string;
  earnings: string;
  deliveryTime: string;
  orderId: string;
  pickup: string;
  delivery: string;
  distanceRemaining: string;
  timeRemaining: string;
  type: 'upcoming' | 'ongoing' | 'completed' | 'declined';
  image: any;
}

interface OrderCardProps {
  order: OrderData;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onAction?: (id: string, actionType: 'ongoing' | 'decline' | 'accept') => void;
}

export function OrderCard({ order, onAccept, onDecline, onAction }: OrderCardProps) {
  const theme = useTheme();

  return (
    <View style={tw`bg-[#121212] rounded-2xl p-4 border border-neutral-900 mb-4`}>
      <View style={tw`flex-row gap-4`}>
        <Image
          source={order.image}
          style={tw`w-20 h-20 rounded-xl`}
          resizeMode="cover"
        />
        <View style={tw`flex-1`}>
          <View style={tw`flex-row justify-between items-start`}>
            <View style={tw`border border-green-600/40 bg-green-950/20 px-2 py-0.5 rounded-md`}>
              <ThemedText style={tw`text-green-500 text-[10px] font-bold`}>
                {order.category}
              </ThemedText>
            </View>
            <ThemedText style={tw`text-neutral-400 text-xs font-semibold`}>
              Earnings : <ThemedText style={tw`text-white font-bold`}>{order.earnings}</ThemedText>
            </ThemedText>
          </View>

          <ThemedText style={tw`text-white font-bold text-base mt-1`}>
            {order.id} - {order.category}
          </ThemedText>

          <ThemedText style={tw`text-[#FF6C00] text-xs mt-1.5 font-semibold`}>
            {order.deliveryTime}
          </ThemedText>
          <ThemedText style={tw`text-neutral-500 text-[10px] mt-0.5`}>
            Order # {order.orderId}
          </ThemedText>
        </View>
      </View>

      <View style={tw`mt-4 pt-4 border-t border-neutral-850/60 gap-3`}>
        <View style={tw`flex-row items-start gap-2.5`}>
          <View style={tw`w-2 h-2 rounded-full bg-[#FF6C00] mt-1.5`} />
          <View style={tw`flex-1`}>
            <ThemedText style={tw`text-neutral-400 text-[10px] font-semibold`}>Pickup location</ThemedText>
            <ThemedText style={tw`text-white text-xs mt-0.5`}>{order.pickup}</ThemedText>
          </View>
        </View>
        <View style={tw`flex-row items-start gap-2.5`}>
          <View style={tw`w-2 h-2 rounded-full bg-red-650 mt-1.5`} />
          <View style={tw`flex-1`}>
            <ThemedText style={tw`text-neutral-400 text-[10px] font-semibold`}>Deliver location</ThemedText>
            <ThemedText style={tw`text-white text-xs mt-0.5`}>{order.delivery}</ThemedText>
          </View>
        </View>
      </View>

      <View style={[tw`flex-row border rounded-xl mt-4`, { borderColor: 'rgba(255, 255, 255, 0.08)' }]}>
        <View style={tw`flex-1 flex-row items-center justify-center py-3 border-r border-neutral-900 gap-2`}>
          <SymbolView
            name={{ ios: 'mappin.circle.fill', android: 'location_on', web: 'location_on' }}
            size={16}
            tintColor="#FF6C00"
          />
          <View>
            <ThemedText style={tw`text-white text-[11px] font-bold`}>{order.distanceRemaining}</ThemedText>
            <ThemedText style={tw`text-neutral-500 text-[9px]`}>Remaining</ThemedText>
          </View>
        </View>
        <View style={tw`flex-1 flex-row items-center justify-center py-3 gap-2`}>
          <SymbolView
            name={{ ios: 'clock.fill', android: 'schedule', web: 'schedule' }}
            size={16}
            tintColor="#FF6C00"
          />
          <View>
            <ThemedText style={tw`text-white text-[11px] font-bold`}>{order.timeRemaining}</ThemedText>
            <ThemedText style={tw`text-neutral-500 text-[9px]`}>Remaining</ThemedText>
          </View>
        </View>
      </View>

      <View style={tw`mt-5`}>
        {order.type === 'upcoming' && (
          <View style={tw`flex-row gap-3`}>
            <Pressable
              onPress={() => {
                onAccept && onAccept(order.orderId);
                onAction && onAction(order.orderId, 'accept');
              }}
              style={({ pressed }) => [
                tw`flex-1 bg-[#FF6C00] py-3.5 rounded-full items-center justify-center shadow-lg`,
                pressed && tw`opacity-90`,
              ]}
            >
              <ThemedText style={tw`text-white font-bold text-sm`}>Accept Task</ThemedText>
            </Pressable>
            <Pressable
              onPress={() => {
                onDecline && onDecline(order.orderId);
                onAction && onAction(order.orderId, 'decline');
              }}
              style={({ pressed }) => [
                tw`flex-1 bg-[#161618] py-3.5 rounded-full items-center justify-center border border-neutral-850`,
                pressed && tw`opacity-80`,
              ]}
            >
              <ThemedText style={tw`text-white font-bold text-sm`}>Decline</ThemedText>
            </Pressable>
          </View>
        )}

        {order.type === 'ongoing' && (
          <Pressable
            onPress={() => onAction && onAction(order.orderId, 'ongoing')}
            style={({ pressed }) => [
              tw`w-full bg-[#FF6C00] py-3.5 rounded-full items-center justify-center shadow-lg`,
              pressed && tw`opacity-90`,
            ]}
          >
            <ThemedText style={tw`text-white font-bold text-sm`}>Ongoing</ThemedText>
          </Pressable>
        )}

        {order.type === 'completed' && (
          <Pressable
            onPress={() => onAction && onAction(order.orderId, 'ongoing')}
            style={({ pressed }) => [
              tw`w-full bg-[#FF6C00] py-3.5 rounded-full items-center justify-center shadow-lg`,
              pressed && tw`opacity-90`,
            ]}
          >
            <ThemedText style={tw`text-white font-bold text-sm`}>Ongoing</ThemedText>
          </Pressable>
        )}

        {order.type === 'declined' && (
          <Pressable
            onPress={() => onAction && onAction(order.orderId, 'decline')}
            style={({ pressed }) => [
              tw`w-full bg-[#EF4444] py-3.5 rounded-full items-center justify-center shadow-lg`,
              pressed && tw`opacity-90`,
            ]}
          >
            <ThemedText style={tw`text-white font-bold text-sm`}>Decline</ThemedText>
          </Pressable>
        )}
      </View>
    </View>
  );
}
