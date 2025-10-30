import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Track } from '../types';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

interface MiniPlayerProps {
  track: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onPress: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  track,
  isPlaying,
  onPlayPause,
  onPress,
}) => {
  if (!track) return null;

  const handlePlayPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPlayPause();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="absolute bottom-16 left-0 right-0 mx-4 mb-2 rounded-2xl overflow-hidden"
      style={{
        shadowColor: '#ff0033',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 10,
      }}
    >
      <LinearGradient
        colors={['#1a1a1a', '#0a0a0a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-row items-center p-3"
      >
        {track.albumArt ? (
          <Image
            source={{ uri: track.albumArt }}
            className="w-12 h-12 rounded-lg"
          />
        ) : (
          <View className="w-12 h-12 rounded-lg bg-dark-hover items-center justify-center">
            <Ionicons name="musical-notes" size={20} color="#ff0033" />
          </View>
        )}

        <View className="flex-1 ml-3">
          <Text className="text-white text-sm font-semibold" numberOfLines={1}>
            {track.title}
          </Text>
          <Text className="text-gray-400 text-xs" numberOfLines={1}>
            {track.artist}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handlePlayPause}
          className="w-10 h-10 rounded-full bg-neon-red items-center justify-center mr-2"
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
};
