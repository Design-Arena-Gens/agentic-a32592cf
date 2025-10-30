import React from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { PlayerControls } from '../components/PlayerControls';
import { Visualizer } from '../components/Visualizer';
import { formatTime } from '../utils/formatTime';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const ALBUM_SIZE = width * 0.75;

interface PlayerScreenProps {
  navigation: any;
  audioPlayer: ReturnType<typeof useAudioPlayer>;
}

export const PlayerScreen: React.FC<PlayerScreenProps> = ({
  navigation,
  audioPlayer,
}) => {
  const { playbackState, togglePlayPause, playNext, playPrevious, seekTo, toggleShuffle, shuffle } =
    audioPlayer;
  const { currentTrack, isPlaying, position, duration } = playbackState;

  if (!currentTrack) {
    return (
      <View className="flex-1 bg-dark-bg items-center justify-center">
        <Text className="text-white">No track selected</Text>
      </View>
    );
  }

  const progress = duration > 0 ? position / duration : 0;
  const circumference = 2 * Math.PI * (ALBUM_SIZE / 2 - 10);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <LinearGradient
        colors={['#ff0033', '#0a0a0a', '#0a0a0a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.4 }}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-down" size={28} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-sm font-semibold">Now Playing</Text>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Album Art with Neon Ring */}
        <View className="items-center justify-center my-8">
          <View className="relative" style={{ width: ALBUM_SIZE, height: ALBUM_SIZE }}>
            {/* Neon Progress Ring */}
            <Svg
              width={ALBUM_SIZE}
              height={ALBUM_SIZE}
              className="absolute"
              style={{
                transform: [{ rotate: '-90deg' }],
              }}
            >
              {/* Background Circle */}
              <Circle
                cx={ALBUM_SIZE / 2}
                cy={ALBUM_SIZE / 2}
                r={ALBUM_SIZE / 2 - 10}
                stroke="#2a2a2a"
                strokeWidth="4"
                fill="none"
              />
              {/* Progress Circle */}
              <Circle
                cx={ALBUM_SIZE / 2}
                cy={ALBUM_SIZE / 2}
                r={ALBUM_SIZE / 2 - 10}
                stroke="#ff0033"
                strokeWidth="4"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </Svg>

            {/* Album Art */}
            <View
              className="absolute items-center justify-center rounded-full overflow-hidden"
              style={{
                top: 15,
                left: 15,
                width: ALBUM_SIZE - 30,
                height: ALBUM_SIZE - 30,
                shadowColor: '#ff0033',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 30,
              }}
            >
              {currentTrack.albumArt ? (
                <Image
                  source={{ uri: currentTrack.albumArt }}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : (
                <View className="w-full h-full bg-dark-card items-center justify-center">
                  <Ionicons name="musical-notes" size={80} color="#ff0033" />
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Visualizer */}
        <View className="mb-4">
          <Visualizer isPlaying={isPlaying} />
        </View>

        {/* Track Info */}
        <View className="px-6 mb-4">
          <Text
            className="text-white text-2xl font-bold text-center mb-2"
            numberOfLines={1}
          >
            {currentTrack.title}
          </Text>
          <Text className="text-gray-400 text-base text-center" numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="px-6 mb-2">
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={seekTo}
            minimumTrackTintColor="#ff0033"
            maximumTrackTintColor="#2a2a2a"
            thumbTintColor="#ff0033"
          />
          <View className="flex-row justify-between">
            <Text className="text-gray-400 text-xs">{formatTime(position)}</Text>
            <Text className="text-gray-400 text-xs">{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Player Controls */}
        <View className="px-6 mb-8">
          <PlayerControls
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            onNext={playNext}
            onPrevious={playPrevious}
            shuffle={shuffle}
            onToggleShuffle={toggleShuffle}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};
