import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Track } from '../types';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

interface SongCardProps {
  track: Track;
  onPress: () => void;
  isPlaying?: boolean;
}

export const SongCard: React.FC<SongCardProps> = ({ track, onPress, isPlaying }) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row items-center p-3 mb-2 bg-dark-card rounded-lg border border-transparent active:border-neon-red"
      style={{
        shadowColor: isPlaying ? '#ff0033' : 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
      }}
    >
      <View className="relative">
        {track.albumArt ? (
          <Image
            source={{ uri: track.albumArt }}
            className="w-14 h-14 rounded-md"
          />
        ) : (
          <View className="w-14 h-14 rounded-md bg-dark-hover items-center justify-center">
            <Ionicons name="musical-notes" size={24} color="#ff0033" />
          </View>
        )}
        {isPlaying && (
          <View className="absolute inset-0 items-center justify-center bg-black/50 rounded-md">
            <Ionicons name="play" size={20} color="#ff0033" />
          </View>
        )}
      </View>

      <View className="flex-1 ml-3">
        <Text
          className="text-white text-base font-semibold"
          numberOfLines={1}
          style={isPlaying ? { color: '#ff0033' } : {}}
        >
          {track.title}
        </Text>
        <Text className="text-gray-400 text-sm" numberOfLines={1}>
          {track.artist}
        </Text>
      </View>

      <Ionicons name="ellipsis-vertical" size={20} color="#666" />
    </TouchableOpacity>
  );
};
