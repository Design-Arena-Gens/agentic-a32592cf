import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  shuffle: boolean;
  onToggleShuffle: () => void;
  size?: 'small' | 'large';
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  shuffle,
  onToggleShuffle,
  size = 'large',
}) => {
  const iconSize = size === 'large' ? 32 : 24;
  const playIconSize = size === 'large' ? 48 : 32;

  const handlePress = (action: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    action();
  };

  return (
    <View className="flex-row items-center justify-center space-x-6">
      <TouchableOpacity onPress={() => handlePress(onToggleShuffle)} className="p-2">
        <Ionicons
          name="shuffle"
          size={iconSize}
          color={shuffle ? '#ff0033' : '#666'}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePress(onPrevious)} className="p-2">
        <Ionicons name="play-skip-back" size={iconSize} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handlePress(onPlayPause)}
        className="w-16 h-16 rounded-full bg-neon-red items-center justify-center"
        style={{
          shadowColor: '#ff0033',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 15,
        }}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={playIconSize}
          color="#fff"
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handlePress(onNext)} className="p-2">
        <Ionicons name="play-skip-forward" size={iconSize} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity className="p-2">
        <Ionicons name="repeat" size={iconSize} color="#666" />
      </TouchableOpacity>
    </View>
  );
};
