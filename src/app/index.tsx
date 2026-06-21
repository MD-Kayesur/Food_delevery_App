import { useState } from 'react';
import { ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tw from 'twrnc';

import { HeaderSection } from '@/components/home/header-section';
import { StatsContainer } from '@/components/home/stats-container';
import { OngoingTaskSection } from '@/components/home/ongoing-task-section';
import { UpcomingRequestsSection } from '@/components/home/upcoming-requests-section';
import { RecentHistorySection } from '@/components/home/recent-history-section';

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
      <HeaderSection
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
        primaryOrange={primaryOrange}
      />

      {/* Stats Container (Today's Earnings / Deliveries) */}
      <StatsContainer
        todayEarnings={todayEarnings}
        todayDeliveries={todayDeliveries}
        primaryOrange={primaryOrange}
      />

      {/* Ongoing Task Section */}
      <OngoingTaskSection
        ongoingTask={ongoingTask}
        onCompleteTask={handleCompleteTask}
        primaryOrange={primaryOrange}
      />

      {/* Upcoming Requests Section */}
      <UpcomingRequestsSection
        upcomingRequest={upcomingRequest}
        onAcceptTask={handleAcceptTask}
        onDeclineTask={handleDeclineTask}
      />

      {/* Recent History Section */}
      <RecentHistorySection
        recentHistory={recentHistory}
        primaryOrange={primaryOrange}
      />
    </ScrollView>
  );
}
