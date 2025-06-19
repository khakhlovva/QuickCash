import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native';

import ActionButton from '~/components/ActionButton';

import { images } from '~/constants';
import { Routes } from '~/constants/routes';

import { useAuth } from '~/context/AuthProvider';

export default function Screen() {
  const { user } = useAuth();

  if (user) return <Redirect href={Routes.OPERATIONS} />;

  return (
    <SafeAreaView className="size-full bg-primary">
      <ScrollView contentContainerClassName="h-full">
        <View className="flex size-full items-center justify-center px-8">
          <Image
            source={images.Cards}
            className="h-[298px] w-full max-w-[380px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-center font-psemibold text-3xl text-white">
              Контролируй {'\n'}
              свои финансы с помощью{' '}
              <Text className="text-secondary">QuickCash</Text>
            </Text>
          </View>

          <Text className="mt-7 w-full max-w-96 text-center font-pregular text-sm text-gray-100">
            Приложение для ведения учета расходов, доходов и накоплений
          </Text>

          <ActionButton
            title="Продолжить"
            handlePress={() => router.push('/sign-in')}
            containerClassname="mt-7 w-full"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}

