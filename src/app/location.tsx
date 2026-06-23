import React, { useState } from 'react';
import { ScrollView, StatusBar, View, Pressable, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';
import { SymbolView } from 'expo-symbols';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import tw from 'twrnc';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { LocationHeader } from '@/components/location/location-header';
import { LocationSearch } from '@/components/location/location-search';
import { NearbyFilterTabs, DemandType } from '@/components/location/nearby-filter-tabs';
import { NearbyAreaCard, AreaData } from '@/components/location/nearby-area-card';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

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

export default function LocationScreen() {
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

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<DemandType>('all');

  const areas: AreaData[] = [
    {
      id: '1',
      name: 'Thornridge',
      distance: '2.4 km',
      demand: 'high',
      demandLabel: 'High Demand',
      description: 'Very busy area',
    },
    {
      id: '2',
      name: 'Thornridge',
      distance: '2.4 km',
      demand: 'high',
      demandLabel: 'High Demand',
      description: 'busy area',
    },
    {
      id: '3',
      name: 'Thornridge',
      distance: '2.4 km',
      demand: 'medium',
      demandLabel: 'Medium Demand',
      description: 'Moderate orders',
    },
    {
      id: '4',
      name: 'Thornridge',
      distance: '2.4 km',
      demand: 'medium',
      demandLabel: 'Medium Demand',
      description: 'Moderate orders',
    },
    {
      id: '5',
      name: 'Thornridge',
      distance: '2.4 km',
      demand: 'low',
      demandLabel: 'Low Demand',
      description: 'Less orders',
    },
  ];

  const filteredAreas = areas.filter((area) => {
    const matchesSearch = area.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeTab === 'all' || area.demand === activeTab;
    return matchesSearch && matchesFilter;
  });

  return (
    <ScrollView
      style={[tw`flex-1`, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[tw`flex-row justify-center`, contentPlatformStyle]}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ThemedView style={tw`max-w-[800px] flex-grow px-5 py-2 gap-4 bg-transparent`}>
        <LocationHeader
          onBackPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/');
            }
          }}
        />

        <LocationSearch
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View style={tw`h-[250px] rounded-2xl overflow-hidden relative mt-2 border border-neutral-900`}>
          {Platform.OS === 'web' || (Platform.OS === 'android' && !isExpoGo) ? (
            <Image
              source={require('@/assets/Frame 263.png')}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
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
                <View style={tw`w-8 h-8 rounded-full bg-red-650 items-center justify-center border-2 border-white`}>
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

          <Pressable style={tw`absolute top-3 right-3 w-8 h-8 rounded-full bg-neutral-900/80 border border-neutral-800 items-center justify-center`}>
            <SymbolView
              name={{ ios: 'scope', android: 'my_location', web: 'my_location' }}
              size={16}
              tintColor="#ffffff"
            />
          </Pressable>

          <View style={tw`absolute bottom-3 right-3 bg-neutral-900/80 rounded-lg p-1 gap-1.5 border border-neutral-800`}>
            <Pressable style={tw`w-6 h-6 items-center justify-center`}>
              <ThemedText style={tw`text-white font-bold text-base`}>+</ThemedText>
            </Pressable>
            <View style={tw`h-[1px] bg-neutral-850`} />
            <Pressable style={tw`w-6 h-6 items-center justify-center`}>
              <ThemedText style={tw`text-white font-bold text-base`}>-</ThemedText>
            </Pressable>
          </View>
        </View>

        <View style={tw`mt-4`}>
          <ThemedText style={tw`text-white text-lg font-bold mb-3`}>
            Nearby Areas
          </ThemedText>

          <NearbyFilterTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {filteredAreas.map((area) => (
            <NearbyAreaCard
              key={area.id}
              area={area}
            />
          ))}

          {filteredAreas.length === 0 && (
            <View style={tw`py-12 items-center justify-center`}>
              <ThemedText style={tw`text-neutral-500 text-sm`}>No areas found matching criteria.</ThemedText>
            </View>
          )}
        </View>

        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}
