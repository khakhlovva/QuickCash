import { useEvent } from 'expo';
import { ResizeMode } from 'expo-av';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  type ViewToken,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { icons } from '~/constants';

import type { Video as VideoType } from '~/types/video';

interface TrendingItemProps {
  activeItem?: VideoType;
  item: VideoType;
}

interface TrendingProps {
  videos: VideoType[];
}

const TrendingItem = ({ activeItem, item }: TrendingItemProps) => {
  const scale = useSharedValue(0.9);

  useEffect(() => {
    if (activeItem?.id === item.id) {
      scale.value = 1;
    } else {
      scale.value = 0.9;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, activeItem]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(scale.value, { duration: 300 }),
      },
    ],
  }));

  const player = useVideoPlayer(item.url ?? '');

  const { isPlaying } = useEvent(player, 'playingChange', {
    isPlaying: player.playing,
  });

  return (
    <Animated.View className="mr-5" style={animatedStyle}>
      {isPlaying ? (
        <VideoView
          player={player}
          style={{ marginTop: 12, height: 288, width: 208, borderRadius: 33 }}
          allowsPictureInPicture
          contentFit={ResizeMode.CONTAIN}
        />
      ) : (
        <TouchableOpacity
          className="relative flex items-center justify-center"
          activeOpacity={0.7}
          onPress={() => player.play()}
        >
          <Image
            source={{
              uri: item.thumbnail_url ?? '',
            }}
            className="my-5 h-72 w-52 overflow-hidden rounded-[33px] shadow-lg shadow-black/40"
            resizeMode="cover"
          />

          <Image
            source={icons.PlayIcon}
            className="absolute size-12"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const Trending = ({ videos }: TrendingProps) => {
  const [activeItem, setActiveItem] = useState(videos[0]);

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken<VideoType>[];
  }) => {
    if (viewableItems.length > 0 && viewableItems[0]) {
      setActiveItem(viewableItems[0].item);
    }
  };

  return (
    <FlatList
      data={videos}
      horizontal
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
    />
  );
};

export default Trending;
