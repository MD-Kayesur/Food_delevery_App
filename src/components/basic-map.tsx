import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function BasicMap() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        // Sets the initial focal point of the map
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922, // Zoom levels
          longitudeDelta: 0.0421,
        }}
      >
        {/* Drop a pin marker anywhere on the map */}
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title="Sample Marker"
          description="This is a description of the location"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
