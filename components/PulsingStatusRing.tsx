import React from 'react';
import { View, StyleSheet } from 'react-native';

interface PulsingStatusRingProps {
  size?: number;
  color?: string;
}

export default function PulsingStatusRing({ 
  size = 70, 
  color = '#FF3B30' 
}: PulsingStatusRingProps) {
  return (
    <View 
      style={[
        styles.ring, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          borderColor: color 
        }
      ]} 
    />
  );
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    borderWidth: 2,
    top: 0,
    left: 0,
  }
});

