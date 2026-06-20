import React from 'react';

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
