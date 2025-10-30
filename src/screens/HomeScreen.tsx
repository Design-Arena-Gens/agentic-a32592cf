import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Track } from '../types';
import { SongCard } from '../components/SongCard';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

interface HomeScreenProps {
  navigation: any;
  audioPlayer: ReturnType<typeof useAudioPlayer>;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation, audioPlayer }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    loadMusic();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTracks(tracks);
    } else {
      const filtered = tracks.filter(
        (track) =>
          track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.album.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTracks(filtered);
    }
  }, [searchQuery, tracks]);

  const loadMusic = async () => {
    try {
      if (!permissionResponse?.granted) {
        const { granted } = await requestPermission();
        if (!granted) {
          setLoading(false);
          return;
        }
      }

      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: 1000,
      });

      const trackList: Track[] = media.assets.map((asset) => ({
        id: asset.id,
        uri: asset.uri,
        filename: asset.filename,
        title: asset.filename.replace(/\.(mp3|wav|flac|m4a)$/i, ''),
        artist: 'Unknown Artist',
        album: 'Unknown Album',
        duration: asset.duration,
        albumArt: undefined,
      }));

      setTracks(trackList);
      setFilteredTracks(trackList);
    } catch (error) {
      console.error('Error loading music:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackPress = (track: Track, index: number) => {
    audioPlayer.setPlayQueue(filteredTracks, index);
    navigation.navigate('Player');
  };

  if (loading) {
    return (
      <View className="flex-1 bg-dark-bg items-center justify-center">
        <ActivityIndicator size="large" color="#ff0033" />
        <Text className="text-white mt-4">Loading your music...</Text>
      </View>
    );
  }

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
          <Text className="text-4xl font-bold text-white mb-4" style={{ textShadowColor: '#ff0033', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20 }}>
            NeonBeat
          </Text>

          <View className="flex-row items-center bg-dark-card rounded-full px-4 py-2">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              className="flex-1 ml-2 text-white"
              placeholder="Search songs, artists..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </LinearGradient>

      <View className="flex-1 px-4 pt-4">
        <Text className="text-gray-400 text-sm mb-2">
          {filteredTracks.length} {filteredTracks.length === 1 ? 'song' : 'songs'}
        </Text>

        <FlatList
          data={filteredTracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <SongCard
              track={item}
              onPress={() => handleTrackPress(item, index)}
              isPlaying={audioPlayer.playbackState.currentTrack?.id === item.id}
            />
          )}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};
