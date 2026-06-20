import { SymbolView } from 'expo-symbols';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Define project pillar details
const ARCHITECTURE_PILLARS = [
  {
    id: 'customer',
    title: 'Customer Portal',
    icon: { ios: 'cart.fill', android: 'shopping_cart', web: 'shopping_cart' },
    badge: 'Web & Mobile',
    description: 'Enables customers to discover restaurants, order meals, track deliveries in real time, and apply promotional discounts.',
    features: [
      'Restaurant search & menu browsing',
      'Shopping cart & coupon checkout engine',
      'Real-time order statuses & chat with rider',
      'Dual review system (for food & delivery)',
    ],
  },
  {
    id: 'rider',
    title: 'Rider Mobile App',
    icon: { ios: 'bicycle', android: 'directions_bike', web: 'motorcycle' },
    badge: 'iOS & Android Native',
    description: 'Empowers riders with shift planners, automated order dispatches, turn-by-turn route navigation, and integrated customer communication.',
    features: [
      'Shift calendar scheduling & booking',
      'Accept/Reject order dispatch sheet',
      'Integrated map route tracking & navigation',
      'Direct customer calling & messaging support',
    ],
  },
  {
    id: 'admin',
    title: 'Admin Management Console',
    icon: { ios: 'square.stack.3d.up.fill', android: 'dashboard', web: 'dashboard' },
    badge: 'Desktop Web Portal',
    description: 'Centralized administration for menu configurations, inventory levels, rider verifications, marketing campaigns, and real-time operations.',
    features: [
      'Comprehensive CRM & customer transaction log',
      'Live driver dispatch mapping & verification portal',
      'Menu item additions & real-time inventory tracking',
      'Promo campaign manager & notification triggers',
    ],
  },
] as const;

export default function HomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

  // Content platform responsive styles
  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  // Pillar selection state
  const [selectedPillar, setSelectedPillar] = useState('customer');

  // Simulator State
  const [isPeak, setIsPeak] = useState(false);
  const [ridersCount, setRidersCount] = useState(12);
  const [ordersCount, setOrdersCount] = useState(8);
  const [deliveredTotal, setDeliveredTotal] = useState(142);
  
  // Real-time Delivery Simulation
  const [simState, setSimState] = useState<'idle' | 'placed' | 'cooking' | 'dispatched' | 'delivered'>('idle');
  const [simProgress, setSimProgress] = useState(0);

  // Handle peak traffic toggle
  const togglePeakTraffic = () => {
    setIsPeak((prev) => {
      const next = !prev;
      if (next) {
        setRidersCount(19);
        setOrdersCount(34);
      } else {
        setRidersCount(12);
        setOrdersCount(8);
      }
      return next;
    });
  };

  // Run the delivery simulation interval
  useEffect(() => {
    let interval: any;
    if (simState !== 'idle' && simState !== 'delivered') {
      interval = setInterval(() => {
        setSimProgress((prev) => {
          if (prev >= 100) {
            setSimState((curr) => {
              if (curr === 'placed') return 'cooking';
              if (curr === 'cooking') return 'dispatched';
              if (curr === 'dispatched') {
                setDeliveredTotal((d) => d + 1);
                setOrdersCount((o) => Math.max(0, o - 1));
                return 'delivered';
              }
              return 'idle';
            });
            return 0;
          }
          return prev + 25;
        });
      }, 600);
    }
    return () => clearInterval(interval);
  }, [simState]);

  // Start new simulation
  const startSimulation = () => {
    if (simState === 'idle' || simState === 'delivered') {
      setSimState('placed');
      setSimProgress(0);
      setOrdersCount((o) => o + 1);
    }
  };

  // Progress Bar styling helper
  const getProgressWidth = () => `${simProgress}%`;

  return (
    <ScrollView
      style={[tw`flex-1`, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[tw`flex-row justify-center`, contentPlatformStyle]}>
      <ThemedView style={tw`max-w-[800px] flex-grow px-6 py-6 gap-4`}>
        
        {/* Hero Banner Section */}
        <View style={tw`items-center justify-center py-8 px-6 gap-2`}>
          <View style={tw`w-[72px] h-[72px] rounded-full bg-[#007AFF] items-center justify-center shadow-lg mb-1`}>
            <SymbolView
              name={{ ios: 'fork.knife', android: 'restaurant', web: 'restaurant' }}
              size={36}
              tintColor="#ffffff"
            />
          </View>
          <ThemedText type="title" style={tw`font-extrabold text-4xl text-center`}>
            Food Delivery App
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={tw`text-center max-w-[500px]`}>
            Developer Console & Architecture Specifications Hub
          </ThemedText>
        </View>

        {/* Real-time System Simulation */}
        <ThemedView type="backgroundElement" style={tw`p-6 rounded-2xl gap-4 border-[1.5px] border-neutral-855/10`}>
          <View style={tw`flex-row justify-between items-center`}>
            <View style={tw`flex-row items-center gap-4`}>
              <View style={[tw`w-2.5 h-2.5 rounded-full`, { backgroundColor: isPeak ? '#FF9500' : '#34C759' }]} />
              <ThemedText type="smallBold">SYSTEM HEALTH SIMULATOR</ThemedText>
            </View>
            <Pressable
              onPress={togglePeakTraffic}
              style={[
                tw`py-1 px-4 rounded-xl`,
                { backgroundColor: isPeak ? '#FF9500' : theme.backgroundSelected }
              ]}>
              <ThemedText type="code" style={{ color: isPeak ? '#000000' : theme.text }}>
                {isPeak ? 'Peak Traffic Active ⚠️' : 'Standard Load'}
              </ThemedText>
            </Pressable>
          </View>

          {/* Quick Metrics Grid */}
          <View style={tw`flex-row flex-wrap gap-4 justify-between`}>
            <View style={tw`flex-1 min-w-[45%] p-4 rounded-lg items-center justify-center bg-neutral-500/5`}>
              <ThemedText type="subtitle" style={tw`font-extrabold text-2xl`}>
                {ridersCount}
              </ThemedText>
              <ThemedText type="code" themeColor="textSecondary">Active Riders</ThemedText>
            </View>
            <View style={tw`flex-1 min-w-[45%] p-4 rounded-lg items-center justify-center bg-neutral-500/5`}>
              <ThemedText type="subtitle" style={tw`font-extrabold text-2xl`}>
                {ordersCount}
              </ThemedText>
              <ThemedText type="code" themeColor="textSecondary">Pending Orders</ThemedText>
            </View>
            <View style={tw`flex-1 min-w-[45%] p-4 rounded-lg items-center justify-center bg-neutral-500/5`}>
              <ThemedText type="subtitle" style={tw`font-extrabold text-2xl`}>
                {deliveredTotal}
              </ThemedText>
              <ThemedText type="code" themeColor="textSecondary">Delivered Total</ThemedText>
            </View>
            <View style={tw`flex-1 min-w-[45%] p-4 rounded-lg items-center justify-center bg-neutral-500/5`}>
              <ThemedText type="subtitle" style={tw`font-extrabold text-2xl`}>
                {isPeak ? '26m' : '15m'}
              </ThemedText>
              <ThemedText type="code" themeColor="textSecondary">Avg ETA</ThemedText>
            </View>
          </View>

          {/* Simulation Active Controls */}
          
        </ThemedView>

        {/* Project Pillars Selection Grid */}
        <ThemedView style={tw`mt-6 px-2`}>
          <ThemedText type="smallBold" themeColor="textSecondary">SYSTEM ARCHITECTURE</ThemedText>
        </ThemedView>

        <View style={tw`flex-row flex-wrap gap-4`}>
          {ARCHITECTURE_PILLARS.map((pillar) => {
            const isSelected = selectedPillar === pillar.id;
            return (
              <Pressable
                key={pillar.id}
                onPress={() => setSelectedPillar(pillar.id)}
                style={[
                  tw`flex-row items-center gap-4 p-4 rounded-2xl flex-grow`,
                  {
                    backgroundColor: isSelected ? theme.backgroundSelected : theme.backgroundElement,
                    borderColor: isSelected ? '#007AFF' : 'transparent',
                    borderWidth: 1.5,
                  }
                ]}>
                <SymbolView
                  name={pillar.icon}
                  size={24}
                  tintColor={isSelected ? '#007AFF' : theme.text}
                />
                <View style={tw`flex-1`}>
                  <ThemedText type="smallBold" style={{ color: isSelected ? '#007AFF' : theme.text }}>
                    {pillar.title}
                  </ThemedText>
                  <ThemedText type="code" themeColor="textSecondary" style={tw`text-[10px]`}>
                    {pillar.badge}
                  </ThemedText>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Active Pillar Details Card */}
        {ARCHITECTURE_PILLARS.map((pillar) => {
          if (pillar.id !== selectedPillar) return null;
          return (
            <ThemedView key={pillar.id} type="backgroundElement" style={tw`p-6 rounded-2xl gap-2`}>
              <ThemedText type="subtitle" style={tw`text-xl font-bold`}>{pillar.title}</ThemedText>
              <ThemedText style={tw`text-sm leading-5`} themeColor="textSecondary">{pillar.description}</ThemedText>
              <View style={tw`mt-4 gap-2`}>
                <ThemedText type="smallBold" style={tw`text-sm mb-1`}>Core Capabilities:</ThemedText>
                {pillar.features.map((feature, idx) => (
                  <View key={idx} style={tw`flex-row items-center gap-2 pl-1`}>
                    <SymbolView
                      name={{ ios: 'circle.fill', android: 'fiber_manual_record', web: 'circle' }}
                      size={6}
                      tintColor="#007AFF"
                    />
                    <ThemedText type="small" style={tw`text-sm`}>{feature}</ThemedText>
                  </View>
                ))}
              </View>
            </ThemedView>
          );
        })}

        {/* Database Schema Explorer */}
        <ThemedView style={tw`mt-6 px-2`}>
          <ThemedText type="smallBold" themeColor="textSecondary">DATABASE SCHEMAS (POSTGRESQL)</ThemedText>
        </ThemedView>

        <View style={tw`gap-2`}>
          <Collapsible title="1. Authentication & User Profiles">
            <ThemedText type="smallBold" style={tw`text-sm font-bold mb-1 text-[#007AFF]`}>Table: users</ThemedText>
            <ThemedText type="code" style={tw`text-[11px] leading-[18px] opacity-90`}>
              {`id: UUID (Primary Key)\nphone_number: VARCHAR(20) (Unique, Not Null)\nemail: VARCHAR(255) (Unique, Nullable)\npassword_hash: VARCHAR(255)\nrole: VARCHAR(20) ("customer" | "rider" | "staff" | "admin")\nstatus: VARCHAR(20) ("active" | "suspended")`}
            </ThemedText>

            <View style={tw`h-[1px] bg-neutral-800 my-4`} />

            <ThemedText type="smallBold" style={tw`text-sm font-bold mb-1 text-[#007AFF]`}>Table: user_profiles</ThemedText>
            <ThemedText type="code" style={tw`text-[11px] leading-[18px] opacity-90`}>
              {`id: UUID (Matches users.id - 1-to-1 relationship)\nfirst_name: VARCHAR(50) (Not Null)\nlast_name: VARCHAR(50) (Not Null)\navatar_url: TEXT (Nullable)`}
            </ThemedText>
          </Collapsible>

          <Collapsible title="2. Riders & Shift Management">
            <ThemedText type="smallBold" style={tw`text-sm font-bold mb-1 text-[#007AFF]`}>Table: riders</ThemedText>
            <ThemedText type="code" style={tw`text-[11px] leading-[18px] opacity-90`}>
              {`id: UUID (Primary Key, Links to users.id)\nvehicle_type: VARCHAR(20) ("bicycle" | "motorcycle" | "car")\nplate_number: VARCHAR(20) (Nullable)\nis_online: BOOLEAN (Default FALSE)\nlatitude: DOUBLE PRECISION\nlongitude: DOUBLE PRECISION\nrating: NUMERIC(3,2) (Default 5.00)\nverification_status: VARCHAR(20) ("pending" | "verified")\ndocuments: JSONB (License, credentials)`}
            </ThemedText>

            <View style={tw`h-[1px] bg-neutral-800 my-4`} />

            <ThemedText type="smallBold" style={tw`text-sm font-bold mb-1 text-[#007AFF]`}>Table: shifts</ThemedText>
            <ThemedText type="code" style={tw`text-[11px] leading-[18px] opacity-90`}>
              {`id: UUID (Primary Key)\nrider_id: UUID (Foreign Key riders.id)\nstart_time: TIMESTAMP\nend_time: TIMESTAMP\nstatus: VARCHAR(20) ("scheduled" | "checked_in" | "completed")\nactual_start_time: TIMESTAMP\nactual_end_time: TIMESTAMP\nestimated_earnings: NUMERIC(10,2)`}
            </ThemedText>
          </Collapsible>

          <Collapsible title="3. Restaurants, Menus & Inventory">
            <ThemedText type="smallBold" style={tw`text-sm font-bold mb-1 text-[#007AFF]`}>Table: restaurants</ThemedText>
            <ThemedText type="code" style={tw`text-[11px] leading-[18px] opacity-90`}>
              {`id: UUID (Primary Key)\nname: VARCHAR(100) (Not Null)\nlogo_url: TEXT\naddress: TEXT\nlatitude: DOUBLE PRECISION\nlongitude: DOUBLE PRECISION\nis_active: BOOLEAN`}
            </ThemedText>

            <View style={tw`h-[1px] bg-neutral-800 my-4`} />

            <ThemedText type="smallBold" style={tw`text-sm font-bold mb-1 text-[#007AFF]`}>Table: categories</ThemedText>
            <ThemedText type="code" style={tw`text-[11px] leading-[18px] opacity-90`}>
              {`id: UUID (Primary Key)\nrestaurant_id: UUID (Foreign Key restaurants.id)\nname: VARCHAR(50)\ndisplay_order: INT`}
            </ThemedText>

            <View style={tw`h-[1px] bg-neutral-800 my-4`} />

            <ThemedText type="smallBold" style={tw`text-sm font-bold mb-1 text-[#007AFF]`}>Table: menu_items</ThemedText>
            <ThemedText type="code" style={tw`text-[11px] leading-[18px] opacity-90`}>
              {`id: UUID (Primary Key)\ncategory_id: UUID (Foreign Key categories.id)\nname: VARCHAR(100)\ndescription: TEXT\nprice: NUMERIC(10,2)\nimage_url: TEXT\nis_available: BOOLEAN\nstock_count: INT`}
            </ThemedText>
          </Collapsible>

          <Collapsible title="4. Orders & Active Delivery Flows">
            <ThemedText type="smallBold" style={tw`text-sm font-bold mb-1 text-[#007AFF]`}>Table: orders</ThemedText>
            <ThemedText type="code" style={tw`text-[11px] leading-[18px] opacity-90`}>
              {`id: UUID (Primary Key)\ncustomer_id: UUID (Foreign Key users.id)\nrestaurant_id: UUID (Foreign Key restaurants.id)\nrider_id: UUID (Foreign Key riders.id, Nullable)\nstatus: VARCHAR(30) ("pending" | "preparing" | "ready_for_pickup" | "picked_up" | "delivered")\ndelivery_address: TEXT\nsubtotal: NUMERIC(10,2)\ndelivery_fee: NUMERIC(10,2)\ndiscount: NUMERIC(10,2)\ntotal_amount: NUMERIC(10,2)\npayment_method: VARCHAR(20)\npayment_status: VARCHAR(20)`}
            </ThemedText>

            <View style={tw`h-[1px] bg-neutral-800 my-4`} />

            <ThemedText type="smallBold" style={tw`text-sm font-bold mb-1 text-[#007AFF]`}>Table: order_items</ThemedText>
            <ThemedText type="code" style={tw`text-[11px] leading-[18px] opacity-90`}>
              {`id: UUID (Primary Key)\norder_id: UUID (Foreign Key orders.id)\nmenu_item_id: UUID (Foreign Key menu_items.id)\nquantity: INT\nprice: NUMERIC(10,2)\nnotes: TEXT`}
            </ThemedText>
          </Collapsible>

          <Collapsible title="5. Live Support, Chats & Reviews">
            <ThemedText type="smallBold" style={tw`text-sm font-bold mb-1 text-[#007AFF]`}>Table: chat_rooms & chat_messages</ThemedText>
            <ThemedText type="code" style={tw`text-[11px] leading-[18px] opacity-90`}>
              {`chat_rooms: id (UUID), order_id (UUID), is_active (BOOLEAN)\nchat_messages: id (UUID), room_id (UUID), sender_id (UUID), message_text (TEXT), image_url (TEXT)`}
            </ThemedText>

            <View style={tw`h-[1px] bg-neutral-800 my-4`} />

            <ThemedText type="smallBold" style={tw`text-sm font-bold mb-1 text-[#007AFF]`}>Table: reviews</ThemedText>
            <ThemedText type="code" style={tw`text-[11px] leading-[18px] opacity-90`}>
              {`id: UUID (Primary Key)\norder_id: UUID (Foreign Key orders.id)\nreviewer_id: UUID (Foreign Key users.id)\nreview_type: VARCHAR(20) ("food" | "delivery")\nrating: INT (1 to 5 stars)\ncomment: TEXT`}
            </ThemedText>
          </Collapsible>
        </View>

        {/* Resources & Figma Links */}
        <ThemedView style={tw`mt-6 px-2`}>
          <ThemedText type="smallBold" themeColor="textSecondary">PROJECT RESOURCES</ThemedText>
        </ThemedView>

        <View style={tw`gap-2`}>
          <ExternalLink href="https://www.figma.com/design/iig3b1mWILbZRPyBOtaQBU/alipacno-%7C%7C-Custom-UI-U-design-%7C%7C-Bits-wise-%7C%7C-FO11BBB456F87--Copy-?node-id=1400-12221&m=dev" asChild>
            <Pressable style={({ pressed }) => [tw`w-full`, pressed && tw`opacity-70`]}>
              <ThemedView type="backgroundElement" style={tw`flex-row items-center gap-4 p-4 rounded-2xl`}>
                <SymbolView
                  name={{ ios: 'paintbrush.fill', android: 'palette', web: 'palette' }}
                  size={16}
                  tintColor={theme.text}
                />
                <ThemedText type="smallBold" style={tw`text-sm`}>Figma Design Spec (Dev Mode)</ThemedText>
              </ThemedView>
            </Pressable>
          </ExternalLink>

          <ExternalLink href="https://github.com/MD-Kayesur/Food_delevery_App" asChild>
            <Pressable style={({ pressed }) => [tw`w-full`, pressed && tw`opacity-70`]}>
              <ThemedView type="backgroundElement" style={tw`flex-row items-center gap-4 p-4 rounded-2xl`}>
                <SymbolView
                  name={{ ios: 'folder.fill', android: 'folder', web: 'folder' }}
                  size={16}
                  tintColor={theme.text}
                />
                <ThemedText type="smallBold" style={tw`text-sm`}>GitHub Repository</ThemedText>
              </ThemedView>
            </Pressable>
          </ExternalLink>
        </View>

        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}
