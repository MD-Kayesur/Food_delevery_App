import { ThemedText } from '@/components/themed-text';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StatusBar, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';

// Coordinates & Zoom Region for San Francisco Delivery Simulation
const restaurantCoords = { latitude: 37.78825, longitude: -122.4324 };
const deliveryCoords = { latitude: 37.7925, longitude: -122.4200 };
const riderCoords = { latitude: 37.7895, longitude: -122.4260 };

const initialRegion = {
  latitude: 37.7900,
  longitude: -122.4260,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

// Premium Dark Mode Map Styling JSON
const mapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#121212" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#747474" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#121212" }] },
  { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#333333" }] },
  { "featureType": "administrative.country", "elementType": "labels.text.fill", "stylers": [{ "color": "#a0a0a0" }] },
  { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#181818" }] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#202020" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#282828" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#1b1b1b" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#FF6C00" }, { "weight": 1.5 }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0d0d0d" }] }
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  // App Theme colors
  const primaryOrange = '#FF6C00';

  // Toggle Switch & Statistics States
  const [isOnline, setIsOnline] = useState(true);
  const [todayEarnings, setTodayEarnings] = useState(142.50);
  const [todayDeliveries, setTodayDeliveries] = useState(12);

  // Active Ongoing Task State
  const [ongoingTask, setOngoingTask] = useState<{
    id: string;
    customer: string;
    items: string;
    earnings: string;
    timeRemaining: string;
    distanceRemaining: string;
    active: boolean;
  } | null>({
    id: 'TASK #FD-9921',
    customer: 'Lisa',
    items: '2 Items • Burger Combo, Coke',
    earnings: '£8.50',
    timeRemaining: '10 mins',
    distanceRemaining: '2.4 km',
    active: true,
  });

  // Upcoming Request State
  const [upcomingRequest, setUpcomingRequest] = useState<{
    id: string;
    category: string;
    earnings: string;
    deliveryTime: string;
    orderId: string;
    pickup: string;
    delivery: string;
    active: boolean;
  } | null>({
    id: 'TASK #FD-2542',
    category: 'Steaks',
    earnings: '£8.50',
    deliveryTime: 'Delivered on Sunday, May 04, 4:30 PM',
    orderId: 't7ml-2542-o4kj',
    pickup: 'Green Apartment 1901 Thornridge Cir. Shiloh, Hawaii 81063',
    delivery: '1901 Thornridge Cir. Shiloh, Hawaii 81063',
    active: true,
  });

  // Recent History State
  const [recentHistory, setRecentHistory] = useState([
    { id: 'TASK #FD-9915', orderNo: 'Order #23910', earnings: '£8.50' },
    { id: 'TASK #FD-9915', orderNo: 'Order #23910', earnings: '£8.50' },
    { id: 'TASK #FD-9915', orderNo: 'Order #23910', earnings: '£8.50' },
  ]);

  // Handle Complete Task
  const handleCompleteTask = () => {
    if (ongoingTask) {
      // 1. Add to recent history
      setRecentHistory((prev) => [
        {
          id: ongoingTask.id,
          orderNo: `Order #${Math.floor(10000 + Math.random() * 90000)}`,
          earnings: ongoingTask.earnings,
        },
        ...prev,
      ]);
      // 2. Increment earnings and delivery count
      setTodayEarnings((prev) => prev + parseFloat(ongoingTask.earnings.replace('£', '')));
      setTodayDeliveries((prev) => prev + 1);
      // 3. Clear ongoing task
      setOngoingTask(null);
    }
  };

  // Handle Accept Task
  const handleAcceptTask = () => {
    if (upcomingRequest) {
      setOngoingTask({
        id: upcomingRequest.id,
        customer: 'John Doe',
        items: `1 Item • Premium ${upcomingRequest.category}`,
        earnings: upcomingRequest.earnings,
        timeRemaining: '15 mins',
        distanceRemaining: '3.1 km',
        active: true,
      });
      setUpcomingRequest(null);
    }
  };

  // Handle Decline Task
  const handleDeclineTask = () => {
    setUpcomingRequest(null);
  };

  return (
    <ScrollView
      style={tw`flex-1 bg-black`}
      contentContainerStyle={[
        tw`pb-28 px-4`,
        { paddingTop: Math.max(insets.top, 16) }
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Header Section */}
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
            onPress={() => setIsOnline(!isOnline)}
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

      {/* Stats Container (Today's Earnings / Deliveries) */}
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

      {/* Ongoing Task Section */}
      <View style={tw`mb-6`}>
        <ThemedText style={tw`text-white text-lg font-bold mb-3`}>Ongoing Task</ThemedText>
        {ongoingTask ? (
          <View style={tw`bg-[#121212] rounded-2xl p-4 border border-neutral-900`}>
            {/* Task Card Header */}
            <View style={tw`flex-row items-center justify-between mb-3`}>
              <View style={tw`bg-neutral-800 px-2.5 py-1 rounded-full`}>
                <ThemedText style={tw`text-[#FF6C00] text-xs font-bold`}>{ongoingTask.id}</ThemedText>
              </View>
              <Pressable style={tw`w-8 h-8 rounded-full bg-neutral-800 items-center justify-center`}>
                <SymbolView
                  name={{ ios: 'scope', android: 'my_location', web: 'my_location' }}
                  size={16}
                  tintColor="#ffffff"
                />
              </Pressable>
            </View>

            <View style={tw`h-[220px] rounded-xl overflow-hidden relative mb-4`}>
              {Platform.OS === 'web' || Platform.OS === 'android' ? (
                <>
                  <Image
                    source={require('@/assets/Group 14928.png')}
                    style={tw`w-full h-full`}
                    resizeMode="cover"
                  />

                  {/* Map overlays / Pins */}
                  <View style={[tw`absolute w-8 h-8 rounded-full bg-[#FF6C00] items-center justify-center border-2 border-white`, { top: 32, left: 48 }]}>
                    <SymbolView
                      name={{ ios: 'fork.knife', android: 'restaurant', web: 'restaurant' }}
                      size={14}
                      tintColor="#ffffff"
                    />
                  </View>

                  <View style={[tw`absolute w-8 h-8 rounded-full bg-red-600 items-center justify-center border-2 border-white`, { top: 64, right: 64 }]}>
                    <SymbolView
                      name={{ ios: 'house.fill', android: 'home', web: 'home' }}
                      size={14}
                      tintColor="#ffffff"
                    />
                  </View>

                  {/* Rider Marker */}
                  <View style={[tw`absolute w-7 h-7 rounded-full bg-blue-500 items-center justify-center border-2 border-white shadow-lg`, { top: 120, left: 140 }]}>
                    <View style={tw`w-2.5 h-2.5 rounded-full bg-white`} />
                  </View>
                </>
              ) : (
                <MapView
                  style={tw`w-full h-full`}
                  initialRegion={initialRegion}
                  customMapStyle={mapStyle}
                  showsUserLocation={false}
                  zoomEnabled={true}
                  mapType="standard"
                >
                  <UrlTile
                    urlTemplate="https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                    maximumZ={19}
                    flipY={false}
                    tileSize={256}
                  />
                  <Polyline
                    coordinates={[
                      restaurantCoords,
                      { latitude: 37.78825, longitude: -122.4260 },
                      { latitude: 37.7925, longitude: -122.4260 },
                      deliveryCoords
                    ]}
                    strokeColor="#FF6C00"
                    strokeWidth={4}
                  />
                  <Marker coordinate={restaurantCoords}>
                    <View style={tw`w-8 h-8 rounded-full bg-[#FF6C00] items-center justify-center border-2 border-white`}>
                      <SymbolView
                        name={{ ios: 'fork.knife', android: 'restaurant', web: 'restaurant' }}
                        size={14}
                        tintColor="#ffffff"
                      />
                    </View>
                  </Marker>
                  <Marker coordinate={deliveryCoords}>
                    <View style={tw`w-8 h-8 rounded-full bg-red-600 items-center justify-center border-2 border-white`}>
                      <SymbolView
                        name={{ ios: 'house.fill', android: 'home', web: 'home' }}
                        size={14}
                        tintColor="#ffffff"
                      />
                    </View>
                  </Marker>
                  <Marker coordinate={riderCoords}>
                    <View style={tw`w-7 h-7 rounded-full bg-blue-500 items-center justify-center border-2 border-white shadow-lg`}>
                      <View style={tw`w-2.5 h-2.5 rounded-full bg-white`} />
                    </View>
                  </Marker>
                </MapView>
              )}

              {/* Zoom Controls */}
              <View style={tw`absolute bottom-3 right-3 bg-neutral-900/80 rounded-lg p-1.5 gap-2 border border-neutral-800`}>
                <Pressable style={tw`w-6 h-6 items-center justify-center`}>
                  <ThemedText style={tw`text-white font-bold text-base`}>+</ThemedText>
                </Pressable>
                <View style={tw`h-[1px] bg-neutral-850`} />
                <Pressable style={tw`w-6 h-6 items-center justify-center`}>
                  <ThemedText style={tw`text-white font-bold text-base`}>-</ThemedText>
                </Pressable>
              </View>
            </View>

            {/* Customer Details Block */}
            <View style={tw`flex-row items-center justify-between pb-4 border-b border-neutral-850/60`}>
              <View style={tw`flex-row items-center gap-3`}>
                <Image
                  source={require('@/assets/Frame 2147228939 (1).png')}
                  style={tw`w-11 h-11 rounded-full border border-neutral-800`}
                />
                <View>
                  <ThemedText style={tw`text-white font-bold text-base`}>{ongoingTask.customer}</ThemedText>
                  <ThemedText style={tw`text-neutral-400 text-xs mt-0.5`}>{ongoingTask.items}</ThemedText>
                </View>
              </View>
              <View style={tw`items-end`}>
                <ThemedText style={tw`text-[#FF6C00] font-bold text-base`}>{ongoingTask.earnings}</ThemedText>
                <ThemedText style={tw`text-neutral-400 text-[10px] mt-0.5`}>Earnings</ThemedText>
              </View>
            </View>

            {/* Time / Distance Remaining & Call/Chat Actions */}
            <View style={tw`flex-row items-center justify-between pt-4`}>
              <View style={tw`flex-row gap-5`}>
                <View style={tw`flex-row items-center gap-1.5`}>
                  <SymbolView
                    name={{ ios: 'clock.fill', android: 'schedule', web: 'schedule' }}
                    size={14}
                    tintColor={primaryOrange}
                  />
                  <View>
                    <ThemedText style={tw`text-white text-xs font-bold`}>{ongoingTask.timeRemaining}</ThemedText>
                    <ThemedText style={tw`text-neutral-500 text-[10px]`}>Remaining</ThemedText>
                  </View>
                </View>
                <View style={tw`flex-row items-center gap-1.5`}>
                  <SymbolView
                    name={{ ios: 'mappin', android: 'location_on', web: 'location_on' }}
                    size={14}
                    tintColor={primaryOrange}
                  />
                  <View>
                    <ThemedText style={tw`text-white text-xs font-bold`}>{ongoingTask.distanceRemaining}</ThemedText>
                    <ThemedText style={tw`text-neutral-500 text-[10px]`}>Remaining</ThemedText>
                  </View>
                </View>
              </View>

              <View style={tw`flex-row gap-2`}>
                <Pressable style={tw`w-10 h-10 rounded-full bg-green-600 items-center justify-center shadow-md`}>
                  <SymbolView
                    name={{ ios: 'phone.fill', android: 'phone', web: 'phone' }}
                    size={16}
                    tintColor="#ffffff"
                  />
                </Pressable>
                <Pressable style={tw`w-10 h-10 rounded-full bg-white items-center justify-center shadow-md`}>
                  <SymbolView
                    name={{ ios: 'message.fill', android: 'chat', web: 'chat' }}
                    size={16}
                    tintColor="#121212"
                  />
                </Pressable>
              </View>
            </View>

            {/* Complete Task Trigger */}
            <Pressable
              onPress={handleCompleteTask}
              style={({ pressed }) => [
                tw`w-full bg-[#FF6C00] py-3.5 rounded-full items-center justify-center mt-5 shadow-lg`,
                pressed && tw`opacity-90 scale-[0.99]`,
              ]}
            >
              <ThemedText style={tw`text-white font-bold text-base`}>Complete Task</ThemedText>
            </Pressable>
          </View>
        ) : (
          <View style={tw`bg-[#121212] rounded-2xl p-6 border border-neutral-900 items-center justify-center`}>
            <SymbolView
              name={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
              size={36}
              tintColor={primaryOrange}
            />
            <ThemedText style={tw`text-white font-bold text-base mt-2.5`}>All Tasks Completed!</ThemedText>
            <ThemedText style={tw`text-neutral-400 text-xs mt-1 text-center`}>
              Accept a task from upcoming requests below to start delivering.
            </ThemedText>
          </View>
        )}
      </View>

      {/* Upcoming Requests Section */}
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
                    <ThemedText style={tw`text-green-500 text-[10px] font-bold`}>{upcomingRequest.category}</ThemedText>
                  </View>
                  <ThemedText style={tw`text-white font-bold text-base`}>{upcomingRequest.earnings}</ThemedText>
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
                onPress={handleAcceptTask}
                style={({ pressed }) => [
                  tw`flex-1 bg-[#FF6C00] py-3 rounded-full items-center justify-center shadow-lg`,
                  pressed && tw`opacity-90`,
                ]}
              >
                <ThemedText style={tw`text-white font-bold text-sm`}>Accept Task</ThemedText>
              </Pressable>
              <Pressable
                onPress={handleDeclineTask}
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

      {/* Recent History Section */}
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
    </ScrollView>
  );
}
