import React from 'react';
import { Platform, View, Image, Pressable } from 'react-native';
import { SymbolView } from 'expo-symbols';
import tw from 'twrnc';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';
import { ThemedText } from './themed-text';

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

export default function DeliveryMap() {
  const primaryOrange = '#FF6C00';

  return (
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
            strokeColor={primaryOrange}
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
  );
}
