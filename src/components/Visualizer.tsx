import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

interface VisualizerProps {
  isPlaying: boolean;
  barCount?: number;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  isPlaying,
  barCount = 40,
}) => {
  const bars = Array.from({ length: barCount });

  return (
    <View className="flex-row items-center justify-center h-24 space-x-1">
      {bars.map((_, index) => (
        <VisualizerBar key={index} isPlaying={isPlaying} index={index} />
      ))}
    </View>
  );
};

const VisualizerBar: React.FC<{ isPlaying: boolean; index: number }> = ({
  isPlaying,
  index,
}) => {
  const height = useSharedValue(4);

  useEffect(() => {
    if (isPlaying) {
      const delay = index * 50;
      const duration = 300 + Math.random() * 500;

      height.value = withRepeat(
        withSequence(
          withTiming(Math.random() * 60 + 20, {
            duration,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
          withTiming(4, {
            duration,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          })
        ),
        -1,
        false
      );
    } else {
      height.value = withTiming(4, { duration: 200 });
    }
  }, [isPlaying]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: 3,
          backgroundColor: '#ff0033',
          borderRadius: 2,
          opacity: 0.8,
        },
      ]}
    />
  );
};
