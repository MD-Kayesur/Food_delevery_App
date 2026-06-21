import { ThemedText } from '@/components/themed-text';
import { SymbolView } from 'expo-symbols';
import { Image, Platform, Pressable, View } from 'react-native';
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

interface OngoingTaskData {
  id: string;
  customer: string;
  items: string;
  earnings: string;
  timeRemaining: string;
  distanceRemaining: string;
  active: boolean;
}

interface OngoingTaskSectionProps {
  ongoingTask: OngoingTaskData | null;
  onCompleteTask: () => void;
  primaryOrange?: string;
}

export function OngoingTaskSection({
  ongoingTask,
  onCompleteTask,
  primaryOrange = '#FF6C00',
}: OngoingTaskSectionProps) {
  return (
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
            onPress={onCompleteTask}
            style={({ pressed }) => [
              tw`w-full bg-[#FF6C00] py-3.5 rounded-full items-center justify-center mt-5 shadow-lg`,
              pressed && tw`opacity-90 scale-[0.99]`,
            ]}
          >
            <ThemeTextWrapper>Complete Task</ThemeTextWrapper>
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
  );
}

// Small wrapper because of ThemedText syntax or styles
function ThemeTextWrapper({ children }: { children: React.ReactNode }) {
  return <ThemedText style={tw`text-white font-bold text-base`}>{children}</ThemedText>;
}
