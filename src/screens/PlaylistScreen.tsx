import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Track } from '../types';
import { SongCard } from '../components/SongCard';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const FAVORITES_KEY = 'favorites';

interface PlaylistScreenProps {
  navigation: any;
  audioPlayer: ReturnType<typeof useAudioPlayer>;
}

export const PlaylistScreen: React.FC<PlaylistScreenProps> = ({
  navigation,
  audioPlayer,
}) => {
  const [favorites, setFavorites] = useState<Track[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
      if (favoritesJson) {
        setFavorites(JSON.parse(favoritesJson));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleTrackPress = (track: Track, index: number) => {
    audioPlayer.setPlayQueue(favorites, index);
    navigation.navigate('Player');
  };

  const handlePlayAll = () => {
    if (favorites.length > 0) {
      audioPlayer.setPlayQueue(favorites, 0);
      navigation.navigate('Player');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-bg">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#ff0033', '#0a0a0a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
        className="pt-4 pb-6"
      >
        <View className="px-4">
          <Text
            className="text-4xl font-bold text-white mb-2"
            style={{
              textShadowColor: '#ff0033',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 20,
            }}
          >
            Liked Songs
          </Text>
          <Text className="text-gray-400 text-sm">
            {favorites.length} {favorites.length === 1 ? 'song' : 'songs'}
          </Text>
        </View>
      </LinearGradient>

      <View className="flex-1 px-4 pt-4">
        {favorites.length > 0 ? (
          <>
            <TouchableOpacity
              onPress={handlePlayAll}
              className="flex-row items-center justify-center bg-neon-red rounded-full py-3 mb-4"
              style={{
                shadowColor: '#ff0033',
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 10,
              }}
            >
              <Ionicons name="play" size={20} color="#fff" />
              <Text className="text-white font-bold ml-2">Play All</Text>
            </TouchableOpacity>

            <FlatList
              data={favorites}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <SongCard
                  track={item}
                  onPress={() => handleTrackPress(item, index)}
                  isPlaying={
                    audioPlayer.playbackState.currentTrack?.id === item.id
                  }
                />
              )}
              contentContainerStyle={{ paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="heart-outline" size={80} color="#2a2a2a" />
            <Text className="text-gray-400 text-lg mt-4">No liked songs yet</Text>
            <Text className="text-gray-600 text-sm mt-2 text-center px-8">
              Songs you like will appear here
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
