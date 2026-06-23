// Custom application tabs configuration with floating capsule layout matching the design image using twrnc
import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { View, Pressable, Platform, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

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
        name="orders"
        options={{
          title: 'Orders',
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
        name="location"
        options={{
          title: 'Location',
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
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{ ios: 'person', android: 'person', web: 'person' }}
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

  const isDark = scheme === 'dark';
  const bottomOffset = Platform.OS === 'ios' ? insets.bottom + 8 : 16;

  // Active & inactive colors matching the orange and grey themes from the design
  const activeColor = '#FF6C00';
  const inactiveColor = isDark ? '#6E7175' : '#8E9195';

  return (
    <View
      style={[
        tw`absolute left-5 right-5 h-[76px] rounded-[38px] border flex-row items-center justify-around px-2 shadow-lg`,
        {
          backgroundColor: isDark ? '#0A0A0A' : '#F0F0F3',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
          bottom: bottomOffset,
          // Custom shadow overrides for premium look on native devices
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 8,
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

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={tw`flex-1 items-center justify-center h-full`}
          >
            {isFocused ? (
              <View
                style={[
                  tw`flex-row items-center justify-center py-2.5 px-4 rounded-[20px] border-[1.5px]`,
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
              <View style={tw`py-2.5 px-4 items-center justify-center`}>
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
