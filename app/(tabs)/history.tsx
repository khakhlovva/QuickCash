import { Redirect, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '~/components/EmptyState';
import LogCard from '~/components/LogCard';
import VideoCard from '~/components/VideoCard';

import { Routes } from '~/constants/routes';

import { Log, OperationType, OperationTypeLabels } from '~/types/log';
import type { VideoWithCreator } from '~/types/video';

import { supabase } from '~/lib/supabase';

import { useAuth } from '~/context/AuthProvider';

const History = () => {
  const { user, profile } = useAuth();

  const path = usePathname();

  const [logs, setLogs] = useState<Log[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    if (!user?.id) return;

    setIsLoading(true);

    const { data: logs } = await supabase
      .from('Log')
      .select('*')
      .eq('userId', user.id)
      .order('createdAt', { ascending: false });

    if (logs && profile) {
      setLogs(logs);
    }

    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);

    await fetchLogs();

    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchLogs();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (path === Routes.HISTORY) {
      handleRefresh();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  if (!user) return <Redirect href={Routes.SIGN_IN} />;

  if (isLoading) {
    return (
      <View className="flex size-full items-center justify-center bg-primary">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="size-full bg-primary">
      <FlatList
        data={logs}
        renderItem={({ item }) => (
          <LogCard
            id={item.id}
            label={OperationTypeLabels[item.operationType as OperationType]}
            sectionName={item.sectionName}
            operationType={item.operationType as OperationType}
            quantity={+item.quantity}
            createdAt={new Date(item.createdAt)}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 flex gap-6 px-6">
            <Text className="font-psemibold text-2xl text-white">История</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Ничего не найдено"
            subtitle="Добавь сумму в секцию"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default History;

