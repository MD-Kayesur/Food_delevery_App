import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Columns interfaces
interface ColumnSpec {
  name: string;
  type: string;
  constraints: ('PK' | 'FK' | 'UK' | 'Not Null' | 'Nullable' | 'Default')[];
  desc: string;
  ref?: string;
}

interface TableSpec {
  name: string;
  category: 'auth' | 'riders' | 'restaurants' | 'orders' | 'support' | 'marketing';
  description: string;
  columns: ColumnSpec[];
}

const DATABASE_SCHEMAS: TableSpec[] = [
  {
    name: 'users',
    category: 'auth',
    description: 'Central registry for all users (Customers, Riders, Staff, and Admins).',
    columns: [
      { name: 'id', type: 'UUID', constraints: ['PK', 'Default'], desc: 'Unique identifier for each user' },
      { name: 'phone_number', type: 'VARCHAR(20)', constraints: ['UK', 'Not Null'], desc: 'Primary identity for OTP verification' },
      { name: 'email', type: 'VARCHAR(255)', constraints: ['UK', 'Nullable'], desc: 'Alternative login and receipt delivery' },
      { name: 'password_hash', type: 'VARCHAR(255)', constraints: ['Nullable'], desc: 'Encrypted passwords for Staff/Admin portal' },
      { name: 'role', type: 'VARCHAR(20)', constraints: ['Not Null'], desc: 'Role type: "customer", "rider", "staff", "admin"' },
      { name: 'status', type: 'VARCHAR(20)', constraints: ['Not Null', 'Default'], desc: 'Current account state: "active", "suspended", "inactive"' },
      { name: 'created_at', type: 'TIMESTAMP', constraints: ['Not Null', 'Default'], desc: 'Account creation time' },
      { name: 'updated_at', type: 'TIMESTAMP', constraints: ['Not Null', 'Default'], desc: 'Last update time' },
    ],
  },
  {
    name: 'user_profiles',
    category: 'auth',
    description: 'Supplementary non-security metadata for user profiles.',
    columns: [
      { name: 'id', type: 'UUID', constraints: ['PK', 'FK'], desc: 'Links 1-to-1 to users.id', ref: 'users.id' },
      { name: 'first_name', type: 'VARCHAR(50)', constraints: ['Not Null'], desc: "User's first name" },
      { name: 'last_name', type: 'VARCHAR(50)', constraints: ['Not Null'], desc: "User's last name" },
      { name: 'avatar_url', type: 'TEXT', constraints: ['Nullable'], desc: 'Profile avatar image storage path' },
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
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.headerTitle}>Database Specs</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.headerSubtitle}>
            Browse schemas, constraints, relations, and optimization indexes.
          </ThemedText>
        </View>

        {/* Search Bar */}
        <ThemedView type="backgroundElement" style={styles.searchBox}>
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
            style={[styles.searchInput, { color: theme.text }]}
          />
        </ThemedView>

        {/* Category Tabs Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
          <View style={styles.tabsRow}>
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
                    styles.tabButton,
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
          <ThemedView type="backgroundElement" style={styles.indexesCard}>
            <ThemedText type="smallBold" style={styles.sqlHeader}>INDEXING & OPTIMIZATION PLAN</ThemedText>
            <ThemedText type="code" style={styles.sqlCode}>
              {`-- 1. Rider Geo-tracking optimization during shifts\nCREATE INDEX idx_riders_coords\nON riders (latitude, longitude)\nWHERE is_online = TRUE;\n\n-- 2. Order Status queries for live dispatch tracking\nCREATE INDEX idx_orders_status\nON orders (status);\n\n-- 3. Chat Messages pagination index\nCREATE INDEX idx_chat_messages_room\nON chat_messages (room_id, created_at DESC);\n\n-- 4. User identity quick searches\nCREATE INDEX idx_users_phone\nON users (phone_number);`}
            </ThemedText>
          </ThemedView>
        ) : (
          <View style={styles.tablesList}>
            {filteredTables.map((table) => {
              const isExpanded = expandedTable === table.name;
              return (
                <ThemedView key={table.name} type="backgroundElement" style={styles.tableCard}>
                  <Pressable
                    onPress={() => setExpandedTable(isExpanded ? null : table.name)}
                    style={styles.tableCardHeader}>
                    <View style={styles.tableNameContainer}>
                      <SymbolView
                        name={{ ios: 'tablecells', android: 'grid_on', web: 'table_chart' }}
                        size={18}
                        tintColor="#007AFF"
                      />
                      <ThemedText type="smallBold" style={styles.tableName}>{table.name}</ThemedText>
                    </View>
                    <SymbolView
                      name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
                      size={14}
                      tintColor={theme.textSecondary}
                      style={{ transform: [{ rotate: isExpanded ? '-90deg' : '90deg' }] }}
                    />
                  </Pressable>

                  {isExpanded && (
                    <View style={styles.tableDetails}>
                      <ThemedText type="small" themeColor="textSecondary" style={styles.tableDesc}>
                        {table.description}
                      </ThemedText>
                      
                      <View style={styles.columnsList}>
                        <View style={styles.columnHeaderRow}>
                          <ThemedText type="code" style={[styles.colHeader, { flex: 2 }]}>COLUMN</ThemedText>
                          <ThemedText type="code" style={[styles.colHeader, { flex: 2 }]}>TYPE</ThemedText>
                          <ThemedText type="code" style={[styles.colHeader, { flex: 3 }]}>CONSTRAINTS</ThemedText>
                        </View>

                        {table.columns.map((col) => (
                          <View key={col.name} style={styles.columnDataRow}>
                            <View style={{ flex: 2 }}>
                              <ThemedText type="code" style={styles.colNameText}>{col.name}</ThemedText>
                              {col.ref && (
                                <ThemedText type="code" style={styles.refText}>
                                  🔑 ref: {col.ref}
                                </ThemedText>
                              )}
                            </View>
                            
                            <ThemedText type="code" themeColor="textSecondary" style={{ flex: 2, fontSize: 11 }}>
                              {col.type}
                            </ThemedText>
                            
                            <View style={[styles.badgeContainer, { flex: 3 }]}>
                              {col.constraints.map((c) => (
                                <View key={c} style={[styles.badge, { backgroundColor: getConstraintBadgeColor(c) }]}>
                                  <ThemedText type="code" style={styles.badgeText}>{c}</ThemedText>
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
              <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center', marginTop: Spacing.four }}>
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

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.three,
  },
  header: {
    paddingVertical: Spacing.three,
    gap: Spacing.one,
  },
  headerTitle: {
    fontWeight: '800',
  },
  headerSubtitle: {
    lineHeight: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
    outlineStyle: 'none',
  } as any,
  tabsContainer: {
    maxHeight: Spacing.five,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingBottom: Spacing.one,
  },
  tabButton: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
  },
  indexesCard: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.three,
  },
  sqlHeader: {
    color: '#007AFF',
  },
  sqlCode: {
    fontSize: 12,
    lineHeight: 20,
    opacity: 0.95,
  },
  tablesList: {
    gap: Spacing.two,
  },
  tableCard: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  tableCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.three,
  },
  tableNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  tableName: {
    fontWeight: '700',
  },
  tableDetails: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.three,
  },
  tableDesc: {
    lineHeight: 20,
  },
  columnsList: {
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    borderRadius: Spacing.two,
    padding: Spacing.two,
    gap: Spacing.one,
  },
  columnHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.1)',
    paddingBottom: Spacing.one,
    marginBottom: Spacing.one,
  },
  colHeader: {
    fontSize: 10,
    fontWeight: '700',
  },
  columnDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(128, 128, 128, 0.05)',
  },
  colNameText: {
    fontWeight: '700',
    fontSize: 12,
  },
  refText: {
    fontSize: 9,
    color: '#007AFF',
    marginTop: 2,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 8,
    color: '#ffffff',
    fontWeight: '800',
  },
});

// End of file. Database schemas active.
