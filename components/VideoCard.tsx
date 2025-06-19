import { useEvent } from 'expo';
import { ResizeMode } from 'expo-av';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { icons } from '~/constants';

import type { Profile } from '~/types/profile';

import { useAuth } from '~/context/AuthProvider';

import CardMenu from './CardMenu';

interface VideoCardProps {
  id: string;
  title: string;
  creator: Profile;
  thumbnailUrl: string;
  videoUrl: string;
  isSaved?: boolean;
  onDeleteFromSaved?: () => Promise<void>;
}

const VideoCard = ({
  id,
  title,
  creator,
  thumbnailUrl,
  videoUrl,
  isSaved,
  onDeleteFromSaved,
}: VideoCardProps) => {
  const { user } = useAuth();

  const player = useVideoPlayer(videoUrl);

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  return (
    <View className="mb-14 flex flex-col items-center px-4">
      <View className="flex flex-row items-start gap-3">
        <View className="flex flex-1 flex-row items-center justify-center">
          {creator.avatar_url && (
            <View className="flex size-[46px] items-center justify-center rounded-lg border border-secondary">
              <Image
                source={{ uri: creator.avatar_url }}
                className="size-full rounded-lg"
                resizeMode="cover"
              />
            </View>
          )}

          <View className="ml-3 flex flex-1 justify-center gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>

            <Text
              className="font-pregular text-xs text-gray-100"
              numberOfLines={1}
            >
              {creator.username}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <CardMenu
            id={id}
            isSaved={!!isSaved}
            isDeletable={creator.id === user?.id}
            onDeleteFromSaved={onDeleteFromSaved}
          />
        </View>
      </View>

      {isPlaying ? (
        <VideoView
          player={player}
          style={{
            marginTop: 12,
            height: 240,
            width: '100%',
            borderRadius: 12,
          }}
          allowsPictureInPicture
          contentFit={ResizeMode.CONTAIN}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => player.play()}
          className="relative mt-3 flex h-60 w-full items-center justify-center rounded-xl"
        >
          <Image
            source={{ uri: thumbnailUrl }}
            className="mt-3 size-full rounded-xl"
            resizeMode="cover"
          />

          <Image
            source={icons.PlayIcon}
            className="absolute size-12"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
