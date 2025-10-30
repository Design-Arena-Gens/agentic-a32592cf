import { useState, useEffect, useCallback, useRef } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Track, PlaybackState } from '../types';

const LAST_TRACK_KEY = 'lastPlayedTrack';
const LAST_POSITION_KEY = 'lastPosition';

export const useAudioPlayer = () => {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentTrack: null,
    position: 0,
    duration: 0,
    isLoading: false,
  });

  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });

    loadLastPlayedTrack();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const loadLastPlayedTrack = async () => {
    try {
      const lastTrackJson = await AsyncStorage.getItem(LAST_TRACK_KEY);
      const lastPosition = await AsyncStorage.getItem(LAST_POSITION_KEY);

      if (lastTrackJson) {
        const lastTrack = JSON.parse(lastTrackJson);
        setPlaybackState(prev => ({ ...prev, currentTrack: lastTrack }));
      }
    } catch (error) {
      console.error('Error loading last track:', error);
    }
  };

  const saveLastPlayedTrack = async (track: Track, position: number) => {
    try {
      await AsyncStorage.setItem(LAST_TRACK_KEY, JSON.stringify(track));
      await AsyncStorage.setItem(LAST_POSITION_KEY, position.toString());
    } catch (error) {
      console.error('Error saving last track:', error);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPlaybackState(prev => ({
        ...prev,
        isPlaying: status.isPlaying,
        position: status.positionMillis,
        duration: status.durationMillis || 0,
        isLoading: false,
      }));

      if (status.didJustFinish) {
        playNext();
      }

      if (playbackState.currentTrack && status.positionMillis % 5000 < 100) {
        saveLastPlayedTrack(playbackState.currentTrack, status.positionMillis);
      }
    }
  };

  const loadAndPlayTrack = async (track: Track, startPosition = 0) => {
    try {
      setPlaybackState(prev => ({ ...prev, isLoading: true }));

      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: track.uri },
        { shouldPlay: true, positionMillis: startPosition },
        onPlaybackStatusUpdate
      );

      soundRef.current = sound;
      setPlaybackState(prev => ({
        ...prev,
        currentTrack: track,
        isPlaying: true,
        isLoading: false,
      }));

      await saveLastPlayedTrack(track, startPosition);
    } catch (error) {
      console.error('Error loading track:', error);
      setPlaybackState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const play = useCallback(async (track?: Track) => {
    if (track) {
      await loadAndPlayTrack(track);
    } else if (soundRef.current) {
      await soundRef.current.playAsync();
    }
  }, []);

  const pause = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
    }
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (playbackState.isPlaying) {
      await pause();
    } else {
      await play();
    }
  }, [playbackState.isPlaying, play, pause]);

  const playNext = useCallback(async () => {
    if (queue.length === 0) return;

    let nextIndex = currentIndex + 1;
    if (nextIndex >= queue.length) {
      nextIndex = 0;
    }

    setCurrentIndex(nextIndex);
    await loadAndPlayTrack(queue[nextIndex]);
  }, [queue, currentIndex]);

  const playPrevious = useCallback(async () => {
    if (queue.length === 0) return;

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = queue.length - 1;
    }

    setCurrentIndex(prevIndex);
    await loadAndPlayTrack(queue[prevIndex]);
  }, [queue, currentIndex]);

  const seekTo = useCallback(async (position: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(position);
    }
  }, []);

  const setVolume = useCallback(async (volume: number) => {
    if (soundRef.current) {
      await soundRef.current.setVolumeAsync(volume);
    }
  }, []);

  const setPlayQueue = useCallback((tracks: Track[], startIndex = 0) => {
    setQueue(tracks);
    setCurrentIndex(startIndex);
    if (tracks.length > 0) {
      loadAndPlayTrack(tracks[startIndex]);
    }
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  return {
    playbackState,
    play,
    pause,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    setPlayQueue,
    toggleShuffle,
    shuffle,
    queue,
  };
};
