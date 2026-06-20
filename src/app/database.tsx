import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Database Schema representation
interface Column {
  name: string;
  type: string;
  constraints: string[];
  desc: string;
  ref?: string;
}

interface TableSchema {
  name: string;
  category: 'auth' | 'riders' | 'restaurants' | 'orders' | 'support' | 'marketing';
  description: string;
  columns: Column[];
}

const DATABASE_SCHEMAS: TableSchema[] = [
  {
    name: 'users',
    category: 'auth',
    description: 'Central user identity database, determining system-wide access roles.',
    columns: [
      { name: 'id', type: 'UUID', constraints: ['PK', 'Default'], desc: 'Unique account identifier' },
      { name: 'phone_number', type: 'VARCHAR(20)', constraints: ['UK', 'Not Null'], desc: 'Used for SMS OTP authentication' },
      { name: 'email', type: 'VARCHAR(255)', constraints: ['UK', 'Nullable'], desc: 'Optional customer contact email' },
      { name: 'password_hash', type: 'VARCHAR(255)', constraints: ['Not Null'], desc: 'Bcrypt credentials storage' },
      { name: 'role', type: 'VARCHAR(20)', constraints: ['Not Null', 'Default'], desc: 'Role permissions: "customer", "rider", "staff", "admin"' },
      { name: 'status', type: 'VARCHAR(20)', constraints: ['Not Null', 'Default'], desc: 'Account status: "active", "suspended"' },
    ],
  },
  {
    name: 'user_profiles',
    category: 'auth',
    description: 'Personal metadata mapping to user accounts.',
    columns: [
      { name: 'id', type: 'UUID', constraints: ['PK', 'FK'], desc: '1-to-1 link to users.id', ref: 'users.id' },
      { name: 'first_name', type: 'VARCHAR(50)', constraints: ['Not Null'], desc: 'User given name' },
      { name: 'last_name', type: 'VARCHAR(50)', constraints: ['Not Null'], desc: 'User family name' },
      { name: 'avatar_url', type: 'TEXT', constraints: ['Nullable'], desc: 'Profile avatar image storage link' },
    ],
  },
  {
    name: 'riders',
    category: 'riders',
    description: 'Extended rider metadata, including location coordinates and ratings.',
    columns: [
      { name: 'id', type: 'UUID', constraints: ['PK', 'FK'], desc: 'Links to users.id', ref: 'users.id' },
      { name: 'vehicle_type', type: 'VARCHAR(20)', constraints: ['Not Null'], desc: 'Type: "bicycle", "motorcycle", "car"' },
      { name: 'plate_number', type: 'VARCHAR(20)', constraints: ['Nullable'], desc: 'Vehicle registration identification plate' },
      { name: 'is_online', type: 'BOOLEAN', constraints: ['Not Null', 'Default'], desc: 'Rider online/offline toggle state' },
      { name: 'latitude', type: 'DOUBLE PRECISION', constraints: ['Nullable'], desc: 'Live GPS latitude coordinate' },
      { name: 'longitude', type: 'DOUBLE PRECISION', constraints: ['Nullable'], desc: 'Live GPS longitude coordinate' },
      { name: 'rating', type: 'NUMERIC(3,2)', constraints: ['Default'], desc: 'Average rating score (0.00 to 5.00)' },
      { name: 'verification_status', type: 'VARCHAR(20)', constraints: ['Default'], desc: 'Approval state: "pending", "verified", "rejected"' },
      { name: 'documents', type: 'JSONB', constraints: ['Nullable'], desc: 'URLs for license, national ID, and vehicle registration' },
    ],
  },
  {
    name: 'shifts',
    category: 'riders',
    description: 'Schedules and actual working hours logs for riders.',
    columns: [
      { name: 'id', type: 'UUID', constraints: ['PK', 'Default'], desc: 'Unique shift ID' },
      { name: 'rider_id', type: 'UUID', constraints: ['FK', 'Not Null'], desc: 'Rider associated with shift', ref: 'riders.id' },
      { name: 'start_time', type: 'TIMESTAMP', constraints: ['Not Null'], desc: 'Scheduled shift start time' },
      { name: 'end_time', type: 'TIMESTAMP', constraints: ['Not Null'], desc: 'Scheduled shift end time' },
      { name: 'status', type: 'VARCHAR(20)', constraints: ['Not Null', 'Default'], desc: 'Status: "scheduled", "checked_in", "completed", "missed"' },
      { name: 'actual_start_time', type: 'TIMESTAMP', constraints: ['Nullable'], desc: 'Time rider checked in online' },
      { name: 'actual_end_time', type: 'TIMESTAMP', constraints: ['Nullable'], desc: 'Time rider completed the shift' },
      { name: 'estimated_earnings', type: 'NUMERIC(10,2)', constraints: ['Default'], desc: 'Estimated earnings for scheduling context' },
    ],
  },
  {
    name: 'restaurants',
    category: 'restaurants',
    description: 'Merchant stores and physical branch parameters.',
    columns: [
      { name: 'id', type: 'UUID', constraints: ['PK', 'Default'], desc: 'Unique store identifier' },
      { name: 'name', type: 'VARCHAR(100)', constraints: ['Not Null'], desc: 'Store brand name' },
      { name: 'logo_url', type: 'TEXT', constraints: ['Nullable'], desc: 'Restaurant logo icon image URL' },
      { name: 'address', type: 'TEXT', constraints: ['Not Null'], desc: 'Physical mailing/delivery street address' },
      { name: 'latitude', type: 'DOUBLE PRECISION', constraints: ['Not Null'], desc: 'Store map latitude position' },
      { name: 'longitude', type: 'DOUBLE PRECISION', constraints: ['Not Null'], desc: 'Store map longitude position' },
      { name: 'is_active', type: 'BOOLEAN', constraints: ['Not Null', 'Default'], desc: 'Open for receiving client orders' },
    ],
  },
  {
    name: 'categories',
    category: 'restaurants',
    description: 'Food category groupings per restaurant (Burgers, Sides, Drinks, etc).',
    columns: [
      { name: 'id', type: 'UUID', constraints: ['PK', 'Default'], desc: 'Unique category identifier' },
      { name: 'restaurant_id', type: 'UUID', constraints: ['FK', 'Not Null'], desc: 'Owning restaurant store', ref: 'restaurants.id' },
      { name: 'name', type: 'VARCHAR(50)', constraints: ['Not Null'], desc: 'Category label name' },
      { name: 'display_order', type: 'INT', constraints: ['Default'], desc: 'Ordering position sequence in UI' },
    ],
  },
  {
    name: 'menu_items',
    category: 'restaurants',
    description: 'Detailed food products database with inventory parameters.',
    columns: [
      { name: 'id', type: 'UUID', constraints: ['PK', 'Default'], desc: 'Unique menu item identifier' },
      { name: 'category_id', type: 'UUID', constraints: ['FK', 'Not Null'], desc: 'Owning category classification', ref: 'categories.id' },
      { name: 'name', type: 'VARCHAR(100)', constraints: ['Not Null'], desc: 'Product menu display name' },
      { name: 'description', type: 'TEXT', constraints: ['Nullable'], desc: 'Ingredients and recipe details description' },
      { name: 'price', type: 'NUMERIC(10,2)', constraints: ['Not Null'], desc: 'Cost in local catalog currency' },
      { name: 'image_url', type: 'TEXT', constraints: ['Nullable'], desc: 'Product image URL link' },
      { name: 'is_available', type: 'BOOLEAN', constraints: ['Not Null', 'Default'], desc: 'Controls menu visibility' },
      { name: 'stock_count', type: 'INT', constraints: ['Not Null', 'Default'], desc: 'Current remaining inventory stock levels' },
    ],
  },
  {
    name: 'orders',
    category: 'orders',
    description: 'Main transaction parameters tracking delivery from checkout to receipt.',
    columns: [
      { name: 'id', type: 'UUID', constraints: ['PK', 'Default'], desc: 'Unique order identifier' },
      { name: 'customer_id', type: 'UUID', constraints: ['FK', 'Not Null'], desc: 'Client placing the order', ref: 'users.id' },
      { name: 'restaurant_id', type: 'UUID', constraints: ['FK', 'Not Null'], desc: 'Target merchant store receiving order', ref: 'restaurants.id' },
      { name: 'rider_id', type: 'UUID', constraints: ['FK', 'Nullable'], desc: 'Assigned delivery rider partner', ref: 'riders.id' },
      { name: 'status', type: 'VARCHAR(30)', constraints: ['Not Null', 'Default'], desc: 'Current status state: "pending", "preparing", "ready", "picked_up", "delivered"' },
      { name: 'delivery_address', type: 'TEXT', constraints: ['Not Null'], desc: 'Destination dropoff address description' },
      { name: 'delivery_lat', type: 'DOUBLE PRECISION', constraints: ['Not Null'], desc: 'Destination latitude coordinates' },
      { name: 'delivery_long', type: 'DOUBLE PRECISION', constraints: ['Not Null'], desc: 'Destination longitude coordinates' },
      { name: 'subtotal', type: 'NUMERIC(10,2)', constraints: ['Not Null'], desc: 'Sum of selected items pricing' },
      { name: 'delivery_fee', type: 'NUMERIC(10,2)', constraints: ['Not Null'], desc: 'Computed travel delivery fee' },
      { name: 'discount', type: 'NUMERIC(10,2)', constraints: ['Default'], desc: 'Value discount applied via coupon' },
      { name: 'total_amount', type: 'NUMERIC(10,2)', constraints: ['Not Null'], desc: 'Final invoice charge' },
      { name: 'payment_method', type: 'VARCHAR(20)', constraints: ['Not Null'], desc: 'Method: "cash", "card", "mobile_wallet"' },
      { name: 'payment_status', type: 'VARCHAR(20)', constraints: ['Not Null', 'Default'], desc: 'Status: "pending", "paid", "failed", "refunded"' },
    ],
  },
  {
    name: 'order_items',
    category: 'orders',
    description: 'Row entries representing food items purchased in an order.',
    columns: [
      { name: 'id', type: 'UUID', constraints: ['PK', 'Default'], desc: 'Unique item row identifier' },
      { name: 'order_id', type: 'UUID', constraints: ['FK', 'Not Null'], desc: 'Linked order context', ref: 'orders.id' },
      { name: 'menu_item_id', type: 'UUID', constraints: ['FK', 'Not Null'], desc: 'Linked menu item product', ref: 'menu_items.id' },
      { name: 'quantity', type: 'INT', constraints: ['Not Null'], desc: 'Quantity count ordered' },
      { name: 'price', type: 'NUMERIC(10,2)', constraints: ['Not Null'], desc: 'Unit price captured at transaction' },
      { name: 'notes', type: 'TEXT', constraints: ['Nullable'], desc: 'Custom meal instruction notes' },
    ],
  },
  {
    name: 'chat_rooms',
    category: 'support',
    description: 'Active communications channels between riders and customers.',
    columns: [
      { name: 'id', type: 'UUID', constraints: ['PK', 'Default'], desc: 'Unique chat room ID' },
      { name: 'order_id', type: 'UUID', constraints: ['FK', 'Not Null'], desc: 'Associated delivery context', ref: 'orders.id' },
      { name: 'is_active', type: 'BOOLEAN', constraints: ['Not Null', 'Default'], desc: 'Active status indicator' },
    ],
  },
  {
    name: 'chat_messages',
    category: 'support',
    description: 'Message transcripts sent inside chat rooms.',
    columns: [
      { name: 'id', type: 'UUID', constraints: ['PK', 'Default'], desc: 'Unique message identifier' },
      { name: 'room_id', type: 'UUID', constraints: ['FK', 'Not Null'], desc: 'Linked chat room channel', ref: 'chat_rooms.id' },
      { name: 'sender_id', type: 'UUID', constraints: ['FK', 'Not Null'], desc: 'User who sent message', ref: 'users.id' },
      { name: 'message_text', type: 'TEXT', constraints: ['Not Null'], desc: 'Body message text content' },
      { name: 'image_url', type: 'TEXT', constraints: ['Nullable'], desc: 'Attached picture storage path' },
    ],
  },
  {
    name: 'coupons',
    category: 'marketing',
    description: 'Discount campaigns and validation parameters.',
    columns: [
      { name: 'id', type: 'UUID', constraints: ['PK', 'Default'], desc: 'Unique coupon identifier' },
      { name: 'code', type: 'VARCHAR(50)', constraints: ['UK', 'Not Null'], desc: 'Alphanumeric checkout code' },
      { name: 'discount_type', type: 'VARCHAR(20)', constraints: ['Not Null'], desc: 'Format: "percentage" or "fixed"' },
      { name: 'discount_value', type: 'NUMERIC(10,2)', constraints: ['Not Null'], desc: 'Value amount applied' },
      { name: 'min_order_value', type: 'NUMERIC(10,2)', constraints: ['Not Null', 'Default'], desc: 'Minimum cart threshold requirement' },
      { name: 'start_date', type: 'TIMESTAMP', constraints: ['Not Null'], desc: 'Validation active start date' },
      { name: 'end_date', type: 'TIMESTAMP', constraints: ['Not Null'], desc: 'Validation expiration date' },
      { name: 'is_active', type: 'BOOLEAN', constraints: ['Not Null', 'Default'], desc: 'Campaign status status' },
    ],
  },
  {
    name: 'reviews',
    category: 'marketing',
    description: 'Feedback evaluations submitted by customers.',
    columns: [
      { name: 'id', type: 'UUID', constraints: ['PK', 'Default'], desc: 'Unique review identifier' },
      { name: 'order_id', type: 'UUID', constraints: ['FK', 'Not Null'], desc: 'Target order context', ref: 'orders.id' },
      { name: 'reviewer_id', type: 'UUID', constraints: ['FK', 'Not Null'], desc: 'Author customer reviewer', ref: 'users.id' },
      { name: 'review_type', type: 'VARCHAR(20)', constraints: ['Not Null'], desc: 'Type: "food" or "delivery"' },
      { name: 'rating', type: 'INT', constraints: ['Not Null'], desc: 'Star rating count (1 to 5)' },
      { name: 'comment', type: 'TEXT', constraints: ['Nullable'], desc: 'Written commentary text description' },
    ],
  },
];

export default function DatabaseScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();

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

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'auth' | 'riders' | 'restaurants' | 'orders' | 'support' | 'indexes'>('all');
  const [expandedTable, setExpandedTable] = useState<string | null>(null);

  // Filter logic
  const filteredTables = DATABASE_SCHEMAS.filter((table) => {
    const matchesSearch = table.name.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || table.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const getConstraintBadgeColor = (c: string) => {
    switch (c) {
      case 'PK': return '#FF3B30';
      case 'FK': return '#007AFF';
      case 'UK': return '#34C759';
      case 'Not Null': return '#FF9500';
      case 'Nullable': return '#8E8E93';
      default: return theme.textSecondary;
    }
  };

  return (
    <ScrollView
      style={[tw`flex-1`, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[tw`flex-row justify-center`, contentPlatformStyle]}>
      <ThemedView style={tw`max-w-[800px] flex-grow px-6 py-6 gap-4`}>
        
        {/* Header */}
        <View style={tw`py-4 gap-1`}>
          <ThemedText type="subtitle" style={tw`font-extrabold`}>Database Specs</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={tw`leading-5`}>
            Browse schemas, constraints, relations, and optimization indexes.
          </ThemedText>
        </View>

        {/* Search Bar */}
        <ThemedView type="backgroundElement" style={tw`flex-row items-center px-4 py-3 rounded-2xl gap-4`}>
          <SymbolView
            name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
            size={16}
            tintColor={theme.textSecondary}
          />
          <TextInput
            placeholder="Search database tables..."
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
            style={[tw`flex-1 text-sm p-0`, { color: theme.text, outlineStyle: 'none' } as any]}
          />
        </ThemedView>

        {/* Category Tabs Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`max-h-10`}>
          <View style={tw`flex-row gap-4 pb-2`}>
            {[
              { id: 'all', label: 'All Tables' },
              { id: 'auth', label: 'Auth & Profile' },
              { id: 'riders', label: 'Riders & Shifts' },
              { id: 'restaurants', label: 'Restaurants' },
              { id: 'orders', label: 'Orders & Flows' },
              { id: 'support', label: 'Support & Chat' },
              { id: 'indexes', label: 'Optimization Indexes' },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => {
                    setActiveTab(tab.id as any);
                    setExpandedTable(null);
                  }}
                  style={[
                    tw`py-1 px-4 rounded-xl`,
                    { backgroundColor: isSelected ? theme.backgroundSelected : theme.backgroundElement }
                  ]}>
                  <ThemedText
                    type="smallBold"
                    style={{ color: isSelected ? '#007AFF' : theme.textSecondary }}>
                    {tab.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Conditional rendering for Indexes SQL vs Tables */}
        {activeTab === 'indexes' ? (
          <ThemedView type="backgroundElement" style={tw`p-6 rounded-2xl gap-4`}>
            <ThemedText type="smallBold" style={tw`text-[#007AFF]`}>INDEXING & OPTIMIZATION PLAN</ThemedText>
            <ThemedText type="code" style={tw`text-xs leading-5 opacity-95`}>
              {`-- 1. Rider Geo-tracking optimization during shifts\nCREATE INDEX idx_riders_coords\nON riders (latitude, longitude)\nWHERE is_online = TRUE;\n\n-- 2. Order Status queries for live dispatch tracking\nCREATE INDEX idx_orders_status\nON orders (status);\n\n-- 3. Chat Messages pagination index\nCREATE INDEX idx_chat_messages_room\nON chat_messages (room_id, created_at DESC);\n\n-- 4. User identity quick searches\nCREATE INDEX idx_users_phone\nON users (phone_number);`}
            </ThemedText>
          </ThemedView>
        ) : (
          <View style={tw`gap-4`}>
            {filteredTables.map((table) => {
              const isExpanded = expandedTable === table.name;
              return (
                <ThemedView key={table.name} type="backgroundElement" style={tw`rounded-2xl overflow-hidden`}>
                  <Pressable
                    onPress={() => setExpandedTable(isExpanded ? null : table.name)}
                    style={tw`flex-row justify-between items-center p-4`}>
                    <View style={tw`flex-row items-center gap-4`}>
                      <SymbolView
                        name={{ ios: 'tablecells', android: 'grid_on', web: 'table_chart' }}
                        size={18}
                        tintColor="#007AFF"
                      />
                      <ThemedText type="smallBold" style={tw`font-bold`}>{table.name}</ThemedText>
                    </View>
                    <SymbolView
                      name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                      size={14}
                      tintColor={theme.textSecondary}
                      style={{ transform: [{ rotate: isExpanded ? '-90deg' : '90deg' }] }}
                    />
                  </Pressable>

                  {isExpanded && (
                    <View style={tw`px-4 pb-4 gap-4`}>
                      <ThemedText type="small" themeColor="textSecondary" style={tw`leading-5`}>
                        {table.description}
                      </ThemedText>
                      
                      <View style={tw`bg-neutral-500/5 rounded-xl p-3 gap-1`}>
                        <View style={tw`flex-row border-b border-neutral-500/10 pb-2 mb-2`}>
                          <ThemedText type="code" style={[tw`text-[10px] font-bold`, { flex: 2 }]}>COLUMN</ThemedText>
                          <ThemedText type="code" style={[tw`text-[10px] font-bold`, { flex: 2 }]}>TYPE</ThemedText>
                          <ThemedText type="code" style={[tw`text-[10px] font-bold`, { flex: 3 }]}>CONSTRAINTS</ThemedText>
                        </View>

                        {table.columns.map((col) => (
                          <View key={col.name} style={tw`flex-row items-center py-2 border-b border-neutral-500/5`}>
                            <View style={{ flex: 2 }}>
                              <ThemedText type="code" style={tw`font-bold text-xs`}>{col.name}</ThemedText>
                              {col.ref && (
                                <ThemedText type="code" style={tw`text-[9px] text-[#007AFF] mt-0.5`}>
                                  🔑 ref: {col.ref}
                                </ThemedText>
                              )}
                            </View>
                            
                            <ThemedText type="code" themeColor="textSecondary" style={{ flex: 2, fontSize: 11 }}>
                              {col.type}
                            </ThemedText>
                            
                            <View style={[tw`flex-row flex-wrap gap-1`, { flex: 3 }]}>
                              {col.constraints.map((c) => (
                                <View key={c} style={[tw`py-0.5 px-1.5 rounded`, { backgroundColor: getConstraintBadgeColor(c) }]}>
                                  <ThemedText type="code" style={tw`text-[8px] color-white font-extrabold`}>{c}</ThemedText>
                                </View>
                              ))}
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </ThemedView>
              );
            })}

            {filteredTables.length === 0 && (
              <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center', marginTop: 16 }}>
                No database tables found matching your filter.
              </ThemedText>
            )}
          </View>
        )}

        {Platform.OS === 'web' && <WebBadge />}
      </ThemedView>
    </ScrollView>
  );
}
