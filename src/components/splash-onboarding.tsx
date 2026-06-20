import React, { useState, useEffect } from 'react';
import { View, Pressable, Platform, Dimensions, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import tw from 'twrnc';
import { ThemedText } from './themed-text';

interface SplashOnboardingProps {
  onFinish: () => void;
}

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

export function SplashOnboarding({ onFinish }: SplashOnboardingProps) {
  const [phase, setPhase] = useState<'splash' | 'onboarding'>('splash');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Splash animation shared values
  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const splashOpacity = useSharedValue(1);

  // Onboarding transition shared values
  const slideOpacity = useSharedValue(1);

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

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      // Animate slide transition (fade out then fade in)
      slideOpacity.value = withSequence(
        withTiming(0, { duration: 200 }),
        withTiming(1, { duration: 300 })
      );
      setTimeout(() => {
        setCurrentSlide((prev) => prev + 1);
      }, 200);
    } else {
      // Onboarding finished, fade out entire onboarding screen
      splashOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
        if (finished) {
          runOnJS(onFinish)();
        }
      });
    }
  };

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const animatedSplashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  const animatedSlideStyle = useAnimatedStyle(() => ({
    opacity: slideOpacity.value,
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

  const slide = SLIDES[currentSlide];

  return (
    <Animated.View
      style={[
        tw`absolute inset-0 bg-black justify-between py-12 px-6 z-50`,
        animatedSplashStyle,
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Top Spacing */}
      <View style={tw`h-4`} />

      {/* Slide Content */}
      <Animated.View style={[tw`items-center justify-center flex-1`, animatedSlideStyle]}>
        <Image
          source={slide.image}
          style={[tw`w-[300px] h-[300px] mb-8`, { resizeMode: 'contain' } as any]}
          contentFit="contain"
        />

        {/* Pagination Dots */}
        <View style={tw`flex-row gap-2 mb-8`}>
          {SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={[
                tw`h-2 rounded-full`,
                {
                  width: idx === currentSlide ? 18 : 8,
                  backgroundColor: idx === currentSlide ? '#FF6C00' : '#444444',
                },
              ]}
            />
          ))}
        </View>

        {/* Slide Title */}
        <ThemedText
          type="title"
          style={tw`text-white font-extrabold text-2xl text-center px-4 leading-8 mb-4`}
        >
          {slide.title}
        </ThemedText>

        {/* Slide Subtitle */}
        <ThemedText
          type="small"
          style={tw`text-neutral-400 text-center text-sm font-medium px-6 leading-5`}
        >
          {slide.subtitle}
        </ThemedText>
      </Animated.View>

      {/* Action Button */}
      <View style={tw`px-4 pb-4`}>
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            tw`w-full bg-[#FF6C00] py-4 rounded-[28px] items-center justify-center shadow-lg`,
            pressed && tw`opacity-90 scale-[0.98]`,
          ]}
        >
          <ThemedText style={tw`text-white font-bold text-lg`}>
            {currentSlide === SLIDES.length - 1 ? 'Continue' : 'Next'}
          </ThemedText>
        </Pressable>
      </View>
    </Animated.View>
  );
}
