import React, { useState } from 'react';
import { ScrollView, StatusBar, View, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import tw from 'twrnc';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { OrdersHeader } from '@/components/orders/orders-header';
import { OrdersFilterTabs, TabType } from '@/components/orders/orders-filter-tabs';
import { OrderCard, OrderData } from '@/components/orders/order-card';

export default function OrdersScreen() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    ios: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.four,
      paddingBottom: Spacing.four,
    },
  });

  const [activeTab, setActiveTab] = useState<TabType>('all');

  const [orders, setOrders] = useState<OrderData[]>([
    {
      id: 'TASK #FD-9921',
      category: 'Steaks',
      earnings: '£8.50',
      deliveryTime: 'Delivered on Sunday, May 04, 4:30 PM',
      orderId: 't7ml-2542-o4kj',
      pickup: '7 Elm Street, Woodstock, OX7 1ER',
      delivery: '7 Elm Street, Woodstock, OX7 1ER',
      distanceRemaining: '2.4 km',
      timeRemaining: '10 mins',
      type: 'upcoming',
      image: require('@/assets/food1.png'),
    },
    {
      id: 'TASK #FD-9922',
      category: 'Steaks',
      earnings: '£8.50',
      deliveryTime: 'Delivered on Sunday, May 04, 4:30 PM',
      orderId: 't7ml-2542-o4kj',
      pickup: '7 Elm Street, Woodstock, OX7 1ER',
      delivery: '1901 Thornridge Cir. Shiloh, Hawaii 81063',
      distanceRemaining: '2.4 km',
      timeRemaining: '10 mins',
      type: 'completed', // Shows "Ongoing" action button as in Figma
      image: require('@/assets/food2.png'),
    },
    {
      id: 'TASK #FD-9923',
      category: 'Steaks',
      earnings: '£8.50',
      deliveryTime: 'Delivered on Sunday, May 04, 4:30 PM',
      orderId: 't7ml-2542-o4kj',
      pickup: '7 Elm Street, Woodstock, OX7 1ER',
      delivery: '7 Elm Street, Woodstock, OX7 1ER',
      distanceRemaining: '2.4 km',
      timeRemaining: '10 mins',
      type: 'declined',
      image: require('@/assets/food3.png'),
    },
  ]);

  const counts: Record<TabType, number> = {
    all: orders.length,
    upcoming: orders.filter((o) => o.type === 'upcoming').length,
    ongoing: orders.filter((o) => o.type === 'ongoing' || o.type === 'completed').length,
    completed: orders.filter((o) => o.type === 'completed').length,
  };

  const handleAction = (id: string, actionType: 'ongoing' | 'decline' | 'accept') => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.orderId === id) {
          if (actionType === 'accept') {
            return { ...order, type: 'completed' }; // Becomes ongoing card
          } else if (actionType === 'decline') {
            return { ...order, type: 'declined' };
          }
        }
        return order;
      })
    );
  };

  const upcomingOrders = orders.filter((o) => o.type === 'upcoming');
  const completedOrders = orders.filter((o) => o.type === 'completed');
  const declinedOrders = orders.filter((o) => o.type === 'declined');

  const showUpcoming = activeTab === 'all' || activeTab === 'upcoming';
  const showCompleted = activeTab === 'all' || activeTab === 'ongoing' || activeTab === 'completed';
  const showDeclined = activeTab === 'all';

  return (
    <ScrollView
      style={[tw`flex-1`, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[tw`flex-row justify-center`, contentPlatformStyle]}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ThemedView style={tw`max-w-[800px] flex-grow px-5 py-2 gap-4 bg-transparent`}>
        <OrdersHeader
          onBackPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/');
            }
          }}
        />

        <OrdersFilterTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={counts}
        />

        {showUpcoming && upcomingOrders.length > 0 && (
          <View style={tw`mb-4`}>
            <View style={tw`flex-row justify-between items-center mb-3`}>
              <View style={tw`flex-row items-center gap-2`}>
                <ThemedText style={tw`text-white text-lg font-bold`}>Upcoming Request</ThemedText>
                <View style={tw`bg-[#FF6C00] w-5 h-5 rounded-full items-center justify-center`}>
                  <ThemedText style={tw`text-white text-xs font-bold`}>
                    {upcomingOrders.length}
                  </ThemedText>
                </View>
              </View>
              <Pressable>
                <ThemedText style={tw`text-[#FF6C00] text-xs font-bold`}>View All &gt;</ThemedText>
              </Pressable>
            </View>
            {upcomingOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAction={handleAction}
              />
            ))}
          </View>
        )}

        {showCompleted && completedOrders.length > 0 && (
          <View style={tw`mb-4`}>
            <View style={tw`flex-row justify-between items-center mb-3`}>
              <ThemedText style={tw`text-white text-lg font-bold`}>Completed Task</ThemedText>
              <Pressable>
                <ThemedText style={tw`text-[#FF6C00] text-xs font-bold`}>View All &gt;</ThemedText>
              </Pressable>
            </View>
            {completedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAction={handleAction}
              />
            ))}
          </View>
        )}

        {showDeclined && declinedOrders.length > 0 && (
          <View style={tw`mb-4`}>
            <View style={tw`flex-row justify-between items-center mb-3`}>
              <ThemedText style={tw`text-white text-lg font-bold`}>Decline Request</ThemedText>
              <Pressable>
                <ThemedText style={tw`text-[#FF6C00] text-xs font-bold`}>View All &gt;</ThemedText>
              </Pressable>
            </View>
            {declinedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAction={handleAction}
              />
            ))}
          </View>
        )}

        {((activeTab === 'upcoming' && upcomingOrders.length === 0) ||
          (activeTab === 'completed' && completedOrders.length === 0) ||
          (activeTab === 'ongoing' && completedOrders.length === 0)) && (
          <View style={tw`py-12 items-center justify-center`}>
            <ThemedText style={tw`text-neutral-500 text-sm`}>No orders in this category.</ThemedText>
          </View>
        )}

        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}
