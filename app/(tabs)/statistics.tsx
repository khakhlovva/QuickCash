import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Routes } from '~/constants/routes';

import { useAuth } from '~/context/AuthProvider';

const Statistics = () => {
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

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
      <View className="my-6 flex gap-6 px-6">
        <Text className="font-psemibold text-2xl text-white">Статистика</Text>
      </View>
    </SafeAreaView>
  );
};

export default Statistics;

