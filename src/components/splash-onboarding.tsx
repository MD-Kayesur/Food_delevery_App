import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import tw from 'twrnc';

export interface SlideData {
  title: string;
  subtitle: string;
  image: any;
}

export const SLIDES: SlideData[] = [
  {
    title: '“Fast Rides, Safe Journeys — Anytime, Anywhere.”',
    subtitle: "Keep track of your Order's location in real-time.",
    image: require('@/assets/In no time-amico 1.png'),
  },
  {
    title: '“Your Destination Is Just One Tap Away.”',
    subtitle: "Keep track of your Order's location in real-time.",
    image: require('@/assets/Take Away-pana 1.png'),
  },
  {
    title: '“Ride Smarter, Travel Easier.”',
    subtitle: "Keep track of your Order's location in real-time.",
    image: require('@/assets/7709396_3724830 1.png'),
  },
];

interface SplashOnboardingProps {
  onFinish: () => void;
}

export function SplashOnboarding({ onFinish }: SplashOnboardingProps) {
  const [phase, setPhase] = useState<'splash' | 'onboarding'>('splash');

  // Splash animation shared values
  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const splashOpacity = useSharedValue(1);

  useEffect(() => {
    // Start splash animation sequentially:
    // 1. Fade in and scale up the logo
    // 2. Hold the logo for a moment
    // 3. Zoom in the logo and fade out (vanish)
    logoScale.value = withSequence(
      withTiming(1.0, { duration: 800 }),
      withTiming(1.0, { duration: 1000 }),
      withTiming(2.2, { duration: 600 })
    );

    logoOpacity.value = withSequence(
      withTiming(1.0, { duration: 800 }),
      withTiming(1.0, { duration: 1000 }),
      withTiming(0, { duration: 600 }, (finished) => {
        if (finished) {
          runOnJS(setPhase)('onboarding');
        }
      })
    );
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const animatedSplashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  if (phase === 'splash') {
    return (
      <Animated.View
        style={[
          tw`absolute inset-0 bg-black items-center justify-center z-50`,
          animatedSplashStyle,
        ]}
      >
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <Animated.View style={animatedLogoStyle}>
          <Image
            source={require('@/assets/logo.png')}
            style={tw`w-64 h-64`}
            contentFit="contain"
          />
        </Animated.View>
      </Animated.View>
    );
  }

  return null;
}
