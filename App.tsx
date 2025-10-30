import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AudioProvider, useAudio } from './src/context/AudioContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { PlayerScreen } from './src/screens/PlayerScreen';
import { PlaylistScreen } from './src/screens/PlaylistScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { MiniPlayer } from './src/components/MiniPlayer';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const audioPlayer = useAudio();
  const navigationRef = React.useRef<any>(null);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        ref={navigationRef}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0a0a0a',
            borderTopColor: '#1a1a1a',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#ff0033',
          tabBarInactiveTintColor: '#666',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Player') {
              iconName = focused ? 'play-circle' : 'play-circle-outline';
            } else if (route.name === 'Playlists') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home">
          {(props) => <HomeScreen {...props} audioPlayer={audioPlayer} />}
        </Tab.Screen>
        <Tab.Screen name="Player">
          {(props) => <PlayerScreen {...props} audioPlayer={audioPlayer} />}
        </Tab.Screen>
        <Tab.Screen name="Playlists">
          {(props) => <PlaylistScreen {...props} audioPlayer={audioPlayer} />}
        </Tab.Screen>
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>

      <MiniPlayer
        track={audioPlayer.playbackState.currentTrack}
        isPlaying={audioPlayer.playbackState.isPlaying}
        onPlayPause={audioPlayer.togglePlayPause}
        onPress={() => {
          navigationRef.current?.navigate('Player');
        }}
      />
    </View>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </AudioProvider>
  );
}
