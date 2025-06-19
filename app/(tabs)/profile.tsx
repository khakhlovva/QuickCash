import { Redirect, router, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import InfoBox from '~/components/InfoBox';

import { icons } from '~/constants';
import { Routes } from '~/constants/routes';

import { supabase } from '~/lib/supabase';

import { useAuth } from '~/context/AuthProvider';

const Profile = () => {
  const { user, profile } = useAuth();

  const path = usePathname();

  const [remains, setRemains] = useState<number>(0);
  const [expenses, setExpenses] = useState<number>(0);
  const [savings, setSavings] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOperations = async () => {
    if (!user?.id) return;

    setIsLoading(true);

    const now = new Date();
    const firstDayOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
    );
    const lastDayOfMonth = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)
    );

    const [
      { data: accountData, error: accountError },
      { data: expenseData, error: expenseError },
      { data: savingData, error: savingError },
    ] = await Promise.all([
      supabase
        .from('Account')
        .select('*')
        .eq('userId', user.id)
        .gte('updatedAt', firstDayOfMonth.toISOString())
        .lte('updatedAt', lastDayOfMonth.toISOString()),
      supabase
        .from('Expense')
        .select('*')
        .eq('userId', user.id)
        .gte('updatedAt', firstDayOfMonth.toISOString())
        .lte('updatedAt', lastDayOfMonth.toISOString()),
      supabase.from('Saving').select('*').eq('userId', user.id),
    ]);

    if (accountError || expenseError || savingError) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2:
          'Произошла ошибка при попытке получить данные. Попробуйте еще раз',
      });

      return;
    }

    if (accountData) {
      setRemains(accountData.reduce((prev, cur) => prev + cur.quantity, 0));
    }

    if (expenseData) {
      setExpenses(expenseData.reduce((prev, cur) => prev + cur.quantity, 0));
    }

    if (savingData) {
      setSavings(savingData.reduce((prev, cur) => prev + cur.quantity, 0));
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchOperations();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    await fetchOperations();

    setIsRefreshing(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      Toast.show({
        type: 'success',
        text1: 'Успешно',
        text2: 'Вы успешно вышли из системы',
      });

      router.replace(Routes.SIGN_IN);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2:
          error.message || 'Произошла ошибка. Пожалуйста, попробуйте снова',
      });
    }
  };

  useEffect(() => {
    if (path === Routes.PROFILE) {
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
    <SafeAreaView className="h-full bg-primary">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="mt-6 flex w-full items-center justify-center px-4">
          <TouchableOpacity
            onPress={handleLogout}
            className="mb-2 flex w-full items-end"
          >
            <Image
              source={icons.LogOutIcon}
              resizeMode="contain"
              className="h-6 w-6"
            />
          </TouchableOpacity>

          <TouchableOpacity className="size-16">
            <View className="flex size-full items-center justify-center rounded-full bg-secondary">
              <Image
                source={icons.ProfileIcon}
                resizeMode="contain"
                alt="person icon"
                tintColor="#392c6a"
                className="h-1/2 w-1/2"
              />
            </View>
          </TouchableOpacity>

          <InfoBox
            title={profile?.username ?? ''}
            containerClassname="mt-5"
            titleClassname="text-xl"
          />
        </View>

        <View className="mt-10 items-center gap-8 px-4">
          <View className="items-center gap-1">
            <Text className="font-psemibold text-4xl text-white">
              {remains} BYN
            </Text>

            <Text className="text-xl text-white">Остаток за текущий месяц</Text>
          </View>

          <View className="items-center gap-1">
            <Text className="font-psemibold text-4xl text-white">
              {expenses} BYN
            </Text>

            <Text className="text-xl text-white">Расходы за текущий месяц</Text>
          </View>

          <View className="items-center gap-1">
            <Text className="font-psemibold text-4xl text-white">
              {savings} BYN
            </Text>

            <Text className="text-xl text-white">Накопления за все время</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

