import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export const SettingsScreen: React.FC = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [autoPlay, setAutoPlay] = React.useState(true);
  const [highQuality, setHighQuality] = React.useState(false);

  const handleToggle = (setter: (val: boolean) => void, currentValue: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(!currentValue);
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    hasSwitch,
    value,
    onToggle,
    onPress,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    hasSwitch?: boolean;
    value?: boolean;
    onToggle?: () => void;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={hasSwitch}
      className="flex-row items-center p-4 bg-dark-card rounded-lg mb-3"
    >
      <View className="w-10 h-10 rounded-full bg-neon-red/20 items-center justify-center mr-4">
        <Ionicons name={icon as any} size={20} color="#ff0033" />
      </View>

      <View className="flex-1">
        <Text className="text-white text-base font-semibold">{title}</Text>
        {subtitle && (
          <Text className="text-gray-400 text-xs mt-1">{subtitle}</Text>
        )}
      </View>

      {hasSwitch ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#2a2a2a', true: '#ff0033' }}
          thumbColor="#fff"
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#666" />
      )}
    </TouchableOpacity>
  );

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
            className="text-4xl font-bold text-white"
            style={{
              textShadowColor: '#ff0033',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 20,
            }}
          >
            Settings
          </Text>
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-gray-400 text-xs font-semibold mb-3 ml-2">
          PLAYBACK
        </Text>

        <SettingItem
          icon="play-circle"
          title="Auto-play on Start"
          subtitle="Continue playing last song on app launch"
          hasSwitch
          value={autoPlay}
          onToggle={() => handleToggle(setAutoPlay, autoPlay)}
        />

        <SettingItem
          icon="musical-note"
          title="High Quality Audio"
          subtitle="Use more data for better sound"
          hasSwitch
          value={highQuality}
          onToggle={() => handleToggle(setHighQuality, highQuality)}
        />

        <Text className="text-gray-400 text-xs font-semibold mb-3 ml-2 mt-6">
          NOTIFICATIONS
        </Text>

        <SettingItem
          icon="notifications"
          title="Notifications"
          subtitle="Get updates about new features"
          hasSwitch
          value={notifications}
          onToggle={() => handleToggle(setNotifications, notifications)}
        />

        <Text className="text-gray-400 text-xs font-semibold mb-3 ml-2 mt-6">
          ABOUT
        </Text>

        <SettingItem
          icon="information-circle"
          title="About NeonBeat"
          subtitle="Version 1.0.0"
          onPress={() => {}}
        />

        <SettingItem
          icon="heart"
          title="Rate Us"
          subtitle="Share your feedback"
          onPress={() => {}}
        />

        <SettingItem
          icon="share-social"
          title="Share App"
          subtitle="Tell your friends about NeonBeat"
          onPress={() => {}}
        />

        <View className="items-center py-8">
          <Text className="text-gray-600 text-xs">Made with ❤️ for music lovers</Text>
          <Text className="text-neon-red text-xs mt-2 font-semibold">NeonBeat</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
