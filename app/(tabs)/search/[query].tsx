import { Redirect, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '~/components/EmptyState';
import SearchInput from '~/components/SearchInput';
import VideoCard from '~/components/VideoCard';

import { Routes } from '~/constants/routes';

import type { VideoWithCreator } from '~/types/video';

import { supabase } from '~/lib/supabase';

import { useAuth } from '~/context/AuthProvider';

const Home = () => {
  const { user } = useAuth();

  const { query } = useLocalSearchParams();

  const [videos, setVideos] = useState<VideoWithCreator[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchVideos = async () => {
    if (!user?.id) return;

    const { data: videos } = await supabase
      .from('videos')
      .select(
        `
        *,
        profiles (
          *
        )
        `
      )
      .neq('creator_id', user.id)
      .ilike('title', `%${query}%`);

    if (videos) {
      setVideos(
        videos.map(({ creator_id, profiles, ...data }) => ({
          ...data,
          creator: profiles,
        }))
      );
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);

    await fetchVideos();

    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchVideos();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, query]);

  if (!user) return <Redirect href={Routes.SIGN_IN} />;

  return (
    <SafeAreaView className="size-full bg-primary">
      <FlatList
        data={videos}
        renderItem={({ item }) => (
          <VideoCard
            id={item.id}
            title={item.title ?? ''}
            thumbnailUrl={item.thumbnail_url ?? ''}
            videoUrl={item.url ?? ''}
            creator={item.creator}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 flex space-y-6 px-6">
            <View className="mb-6 flex flex-row items-start justify-between">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Search results
                </Text>

                <Text className="font-psemibold text-2xl text-white">
                  {query}
                </Text>
              </View>
            </View>

            <SearchInput
              initialQuery={Array.isArray(query) ? query.toString() : query}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" subtitle="Try another topic" />
        )}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
