# NeonBeat 🎧

A modern, neon-themed music player built with React Native and Expo. Features local music playback, animated visuals, and a stunning dark UI with red neon accents.

## Features

- 🎵 Local music file scanning (MP3, WAV, FLAC, M4A)
- 🎨 Neon-themed UI with glowing effects
- 🎼 Full-featured music player with play/pause, next/previous, shuffle
- 📊 Animated audio visualizer
- 💾 Persistent playback state (remembers last played song)
- ❤️ Favorites/Liked songs playlist
- 🔍 Search functionality
- 📱 Bottom tab navigation
- 🎯 Haptic feedback
- 🌊 Smooth animations with Reanimated

## Installation

```bash
npm install
```

## Running the App

```bash
# Start the Expo development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios
```

## Tech Stack

- **Framework**: React Native with Expo SDK 51
- **Audio**: expo-av
- **Media Access**: expo-media-library
- **Navigation**: React Navigation
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Animations**: React Native Reanimated
- **State Management**: React Context + Hooks
- **Storage**: AsyncStorage

## Permissions

The app requires the following permissions:
- **iOS**: Media Library access
- **Android**: READ_EXTERNAL_STORAGE, READ_MEDIA_AUDIO

## Color Scheme

- Primary: `#ff0033` (Neon Red)
- Accent: `#ff3355`
- Background: `#0a0a0a` (Dark Black)
- Card: `#1a1a1a`
- Text: `#ffffff` (White)

## License

MIT
