import React, { useState, useEffect } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

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
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        
        {/* Hero Banner Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconWrapper}>
            <SymbolView
              name={{ ios: 'fork.knife', android: 'restaurant', web: 'restaurant' }}
              size={36}
              tintColor="#ffffff"
            />
          </View>
          <ThemedText type="title" style={styles.heroTitle}>
            Food Delivery App
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.heroSubtitle}>
            Developer Console & Architecture Specifications Hub
          </ThemedText>
        </View>

        {/* Real-time System Simulation */}
        <ThemedView type="backgroundElement" style={styles.simulatorCard}>
          <View style={styles.simulatorHeader}>
            <View style={styles.titleWithIndicator}>
              <View style={[styles.statusDot, { backgroundColor: isPeak ? '#FF9500' : '#34C759' }]} />
              <ThemedText type="smallBold">SYSTEM HEALTH SIMULATOR</ThemedText>
            </View>
            <Pressable
              onPress={togglePeakTraffic}
              style={[
                styles.pillButton,
                { backgroundColor: isPeak ? '#FF9500' : theme.backgroundSelected }
              ]}>
              <ThemedText type="code" style={{ color: isPeak ? '#000000' : theme.text }}>
                {isPeak ? 'Peak Traffic Active ⚠️' : 'Standard Load'}
              </ThemedText>
            </Pressable>
          </View>

          {/* Quick Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <ThemedText type="subtitle" style={styles.metricVal}>
                {ridersCount}
              </ThemedText>
              <ThemedText type="code" themeColor="textSecondary">Active Riders</ThemedText>
            </View>
            <View style={styles.metricItem}>
              <ThemedText type="subtitle" style={styles.metricVal}>
                {ordersCount}
              </ThemedText>
              <ThemedText type="code" themeColor="textSecondary">Pending Orders</ThemedText>
            </View>
            <View style={styles.metricItem}>
              <ThemedText type="subtitle" style={styles.metricVal}>
                {deliveredTotal}
              </ThemedText>
              <ThemedText type="code" themeColor="textSecondary">Delivered Total</ThemedText>
            </View>
            <View style={styles.metricItem}>
              <ThemedText type="subtitle" style={styles.metricVal}>
                {isPeak ? '26m' : '15m'}
              </ThemedText>
              <ThemedText type="code" themeColor="textSecondary">Avg ETA</ThemedText>
            </View>
          </View>

          
        </ThemedView>

        {/* Project Pillars Selection Grid */}
        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="smallBold" themeColor="textSecondary">SYSTEM ARCHITECTURE</ThemedText>
        </ThemedView>

        <View style={styles.pillarsGrid}>
          {ARCHITECTURE_PILLARS.map((pillar) => {
            const isSelected = selectedPillar === pillar.id;
            return (
              <Pressable
                key={pillar.id}
                onPress={() => setSelectedPillar(pillar.id)}
                style={[
                  styles.pillarButtonCard,
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
                <ThemedText type="smallBold" style={[styles.pillarButtonTitle, { color: isSelected ? '#007AFF' : theme.text }]}>
                  {pillar.title}
                </ThemedText>
                <ThemedText type="code" themeColor="textSecondary" style={styles.pillarButtonBadge}>
                  {pillar.badge}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {/* Active Pillar Details Card */}
        {ARCHITECTURE_PILLARS.map((pillar) => {
          if (pillar.id !== selectedPillar) return null;
          return (
            <ThemedView key={pillar.id} type="backgroundElement" style={styles.pillarDetailCard}>
              <ThemedText type="subtitle" style={styles.detailTitle}>{pillar.title}</ThemedText>
              <ThemedText style={styles.detailDesc} themeColor="textSecondary">{pillar.description}</ThemedText>
              <View style={styles.detailFeaturesList}>
                <ThemedText type="smallBold" style={styles.featuresHeading}>Core Capabilities:</ThemedText>
                {pillar.features.map((feature, idx) => (
                  <View key={idx} style={styles.featureItem}>
                    <SymbolView
                      name={{ ios: 'circle.fill', android: 'fiber_manual_record', web: 'circle' }}
                      size={6}
                      tintColor="#007AFF"
                    />
                    <ThemedText type="small" style={styles.featureItemText}>{feature}</ThemedText>
                  </View>
                ))}
              </View>
            </ThemedView>
          );
        })}

        {/* Database Schema Explorer */}
        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="smallBold" themeColor="textSecondary">DATABASE SCHEMAS (POSTGRESQL)</ThemedText>
        </ThemedView>

        <View style={styles.collapsibleContainer}>
          <Collapsible title="1. Authentication & User Profiles">
            <ThemedText type="smallBold" style={styles.schemaTableTitle}>Table: users</ThemedText>
            <ThemedText type="code" style={styles.schemaCode}>
              {`id: UUID (Primary Key)\nphone_number: VARCHAR(20) (Unique, Not Null)\nemail: VARCHAR(255) (Unique, Nullable)\npassword_hash: VARCHAR(255)\nrole: VARCHAR(20) ("customer" | "rider" | "staff" | "admin")\nstatus: VARCHAR(20) ("active" | "suspended")`}
            </ThemedText>

            <View style={styles.schemaDivider} />

            <ThemedText type="smallBold" style={styles.schemaTableTitle}>Table: user_profiles</ThemedText>
            <ThemedText type="code" style={styles.schemaCode}>
              {`id: UUID (Matches users.id - 1-to-1 relationship)\nfirst_name: VARCHAR(50) (Not Null)\nlast_name: VARCHAR(50) (Not Null)\navatar_url: TEXT (Nullable)`}
            </ThemedText>
          </Collapsible>

          <Collapsible title="2. Riders & Shift Management">
            <ThemedText type="smallBold" style={styles.schemaTableTitle}>Table: riders</ThemedText>
            <ThemedText type="code" style={styles.schemaCode}>
              {`id: UUID (Primary Key, Links to users.id)\nvehicle_type: VARCHAR(20) ("bicycle" | "motorcycle" | "car")\nplate_number: VARCHAR(20) (Nullable)\nis_online: BOOLEAN (Default FALSE)\nlatitude: DOUBLE PRECISION\nlongitude: DOUBLE PRECISION\nrating: NUMERIC(3,2) (Default 5.00)\nverification_status: VARCHAR(20) ("pending" | "verified")\ndocuments: JSONB (License, credentials)`}
            </ThemedText>

            <View style={styles.schemaDivider} />

            <ThemedText type="smallBold" style={styles.schemaTableTitle}>Table: shifts</ThemedText>
            <ThemedText type="code" style={styles.schemaCode}>
              {`id: UUID (Primary Key)\nrider_id: UUID (Foreign Key riders.id)\nstart_time: TIMESTAMP\nend_time: TIMESTAMP\nstatus: VARCHAR(20) ("scheduled" | "checked_in" | "completed")\nactual_start_time: TIMESTAMP\nactual_end_time: TIMESTAMP\nestimated_earnings: NUMERIC(10,2)`}
            </ThemedText>
          </Collapsible>

          <Collapsible title="3. Restaurants, Menus & Inventory">
            <ThemedText type="smallBold" style={styles.schemaTableTitle}>Table: restaurants</ThemedText>
            <ThemedText type="code" style={styles.schemaCode}>
              {`id: UUID (Primary Key)\nname: VARCHAR(100) (Not Null)\nlogo_url: TEXT\naddress: TEXT\nlatitude: DOUBLE PRECISION\nlongitude: DOUBLE PRECISION\nis_active: BOOLEAN`}
            </ThemedText>

            <View style={styles.schemaDivider} />

            <ThemedText type="smallBold" style={styles.schemaTableTitle}>Table: categories</ThemedText>
            <ThemedText type="code" style={styles.schemaCode}>
              {`id: UUID (Primary Key)\nrestaurant_id: UUID (Foreign Key restaurants.id)\nname: VARCHAR(50)\ndisplay_order: INT`}
            </ThemedText>

            <View style={styles.schemaDivider} />

            <ThemedText type="smallBold" style={styles.schemaTableTitle}>Table: menu_items</ThemedText>
            <ThemedText type="code" style={styles.schemaCode}>
              {`id: UUID (Primary Key)\ncategory_id: UUID (Foreign Key categories.id)\nname: VARCHAR(100)\ndescription: TEXT\nprice: NUMERIC(10,2)\nimage_url: TEXT\nis_available: BOOLEAN\nstock_count: INT`}
            </ThemedText>
          </Collapsible>

          <Collapsible title="4. Orders & Active Delivery Flows">
            <ThemedText type="smallBold" style={styles.schemaTableTitle}>Table: orders</ThemedText>
            <ThemedText type="code" style={styles.schemaCode}>
              {`id: UUID (Primary Key)\ncustomer_id: UUID (Foreign Key users.id)\nrestaurant_id: UUID (Foreign Key restaurants.id)\nrider_id: UUID (Foreign Key riders.id, Nullable)\nstatus: VARCHAR(30) ("pending" | "preparing" | "ready_for_pickup" | "picked_up" | "delivered")\ndelivery_address: TEXT\nsubtotal: NUMERIC(10,2)\ndelivery_fee: NUMERIC(10,2)\ndiscount: NUMERIC(10,2)\ntotal_amount: NUMERIC(10,2)\npayment_method: VARCHAR(20)\npayment_status: VARCHAR(20)`}
            </ThemedText>

            <View style={styles.schemaDivider} />

            <ThemedText type="smallBold" style={styles.schemaTableTitle}>Table: order_items</ThemedText>
            <ThemedText type="code" style={styles.schemaCode}>
              {`id: UUID (Primary Key)\norder_id: UUID (Foreign Key orders.id)\nmenu_item_id: UUID (Foreign Key menu_items.id)\nquantity: INT\nprice: NUMERIC(10,2)\nnotes: TEXT`}
            </ThemedText>
          </Collapsible>

          <Collapsible title="5. Live Support, Chats & Reviews">
            <ThemedText type="smallBold" style={styles.schemaTableTitle}>Table: chat_rooms & chat_messages</ThemedText>
            <ThemedText type="code" style={styles.schemaCode}>
              {`chat_rooms: id (UUID), order_id (UUID), is_active (BOOLEAN)\nchat_messages: id (UUID), room_id (UUID), sender_id (UUID), message_text (TEXT), image_url (TEXT)`}
            </ThemedText>

            <View style={styles.schemaDivider} />

            <ThemedText type="smallBold" style={styles.schemaTableTitle}>Table: reviews</ThemedText>
            <ThemedText type="code" style={styles.schemaCode}>
              {`id: UUID (Primary Key)\norder_id: UUID (Foreign Key orders.id)\nreviewer_id: UUID (Foreign Key users.id)\nreview_type: VARCHAR(20) ("food" | "delivery")\nrating: INT (1 to 5 stars)\ncomment: TEXT`}
            </ThemedText>
          </Collapsible>
        </View>

        {/* Resources & Figma Links */}
        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="smallBold" themeColor="textSecondary">PROJECT RESOURCES</ThemedText>
        </ThemedView>

        <View style={styles.linksContainer}>
          <ExternalLink href="https://www.figma.com/design/iig3b1mWILbZRPyBOtaQBU/alipacno-%7C%7C-Custom-UI-U-design-%7C%7C-Bits-wise-%7C%7C-FO11BBB456F87--Copy-?node-id=1400-12221&m=dev" asChild>
            <Pressable style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}>
              <ThemedView type="backgroundElement" style={styles.linkButtonInner}>
                <SymbolView
                  name={{ ios: 'paintbrush.fill', android: 'palette', web: 'palette' }}
                  size={16}
                  tintColor={theme.text}
                />
                <ThemedText type="smallBold" style={styles.linkText}>Figma Design Spec (Dev Mode)</ThemedText>
              </ThemedView>
            </Pressable>
          </ExternalLink>

          <ExternalLink href="https://github.com/MD-Kayesur/Food_delevery_App" asChild>
            <Pressable style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}>
              <ThemedView type="backgroundElement" style={styles.linkButtonInner}>
                <SymbolView
                  name={{ ios: 'folder.fill', android: 'folder', web: 'folder' }}
                  size={16}
                  tintColor={theme.text}
                />
                <ThemedText type="smallBold" style={styles.linkText}>GitHub Repository</ThemedText>
              </ThemedView>
            </Pressable>
          </ExternalLink>
        </View>

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
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.five,
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  heroIconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: Spacing.one,
  },
  heroTitle: {
    fontWeight: '800',
    fontSize: 40,
    lineHeight: 48,
    textAlign: 'center',
  },
  heroSubtitle: {
    textAlign: 'center',
    maxWidth: 500,
  },
  simulatorCard: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.three,
    borderWidth: 1.5,
    borderColor: 'rgba(128, 128, 128, 0.1)',
  },
  simulatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleWithIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  pillButton: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.three,
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricVal: {
    fontWeight: '800',
    fontSize: 28,
  },
  simulationControls: {
    marginTop: Spacing.two,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.two,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  simulationActiveContainer: {
    gap: Spacing.two,
    padding: Spacing.two,
  },
  simulationStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  simulationStatusText: {
    fontWeight: '600',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  deliveryToast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    marginTop: Spacing.two,
  },
  toastText: {
    fontWeight: '500',
  },
  sectionHeader: {
    marginTop: Spacing.four,
    paddingHorizontal: Spacing.two,
  },
  pillarsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  pillarButtonCard: {
    flex: 1,
    minWidth: 120,
    padding: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  pillarButtonTitle: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  pillarButtonBadge: {
    fontSize: 10,
    textAlign: 'center',
  },
  pillarDetailCard: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  detailDesc: {
    fontSize: 14,
    lineHeight: 22,
  },
  detailFeaturesList: {
    marginTop: Spacing.two,
    gap: Spacing.two,
  },
  featuresHeading: {
    fontSize: 14,
    marginBottom: Spacing.one,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingLeft: Spacing.one,
  },
  featureItemText: {
    fontSize: 14,
  },
  collapsibleContainer: {
    gap: Spacing.two,
  },
  schemaTableTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.one,
    color: '#007AFF',
  },
  schemaCode: {
    fontSize: 11,
    lineHeight: 18,
    opacity: 0.9,
  },
  schemaDivider: {
    height: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    marginVertical: Spacing.three,
  },
  linksContainer: {
    gap: Spacing.two,
  },
  linkButton: {
    width: '100%',
  },
  linkButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  linkText: {
    fontSize: 14,
  },
  pressed: {
    opacity: 0.7,
  },
});
