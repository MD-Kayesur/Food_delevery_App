// Custom application tabs configuration with floating capsule layout matching the design image
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { View, Pressable, StyleSheet, useColorScheme, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'house', android: 'home', web: 'home' }}
              size={24}
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'mappin', android: 'location_on', web: 'location_on' }}
              size={24}
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="work"
        options={{
          title: 'Work',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'clipboard', android: 'assignment_turned_in', web: 'assignment_turned_in' }}
              size={24}
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="database"
        options={{
          title: 'Database',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'creditcard', android: 'account_balance_wallet', web: 'account_balance_wallet' }}
              size={24}
              tintColor={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          backgroundColor: scheme === 'dark' ? '#0A0A0A' : '#F0F0F3',
          borderColor: scheme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
          bottom: Platform.OS === 'ios' ? insets.bottom + 8 : 16,
        },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Orange theme color from the image active state
        const activeColor = '#FF6C00';
        const inactiveColor = scheme === 'dark' ? '#6E7175' : '#8E9195';

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
          >
            {isFocused ? (
              <View
                style={[
                  styles.activeTabWrapper,
                  {
                    borderColor: activeColor,
                    backgroundColor: 'rgba(255, 108, 0, 0.08)',
                  },
                ]}
              >
                {options.tabBarIcon ? (
                  options.tabBarIcon({ focused: true, color: activeColor, size: 24 })
                ) : null}
              </View>
            ) : (
              <View style={styles.inactiveTabWrapper}>
                {options.tabBarIcon ? (
                  options.tabBarIcon({ focused: false, color: inactiveColor, size: 24 })
                ) : null}
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    // Premium soft floating shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activeTabWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  inactiveTabWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
