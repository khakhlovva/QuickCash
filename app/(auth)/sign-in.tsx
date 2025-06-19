import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AppState, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import ActionButton from '~/components/ActionButton';
import FormField from '~/components/FormField';

import { Routes } from '~/constants/routes';

import type { SignInParams } from '~/types/auth';

import { supabase } from '~/lib/supabase';

import { signInSchema } from '~/schemas/auth';

AppState.addEventListener('change', state => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<SignInParams>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInParams) => {
    setIsSubmitting(true);

    const { email, password } = data;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      Toast.show({
        type: 'success',
        text1: 'Успешно',
        text2: 'Вы успешно вошли в систему',
      });

      router.replace(Routes.OPERATIONS);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2:
          error.message || 'Произошла ошибка. Пожалуйста, попробуйте снова',
      });
    }

    setIsSubmitting(false);
  };

  return (
    <SafeAreaView className="size-full bg-primary">
      <ScrollView contentContainerClassName="h-full">
        <View className="flex h-full w-full gap-8 px-8 pt-14">
          <View className="mt-5 flex gap-12">
            <Text className="font-psemibold text-2xl text-white">
              Авторизация
            </Text>

            <View className="flex gap-6">
              <FormProvider {...methods}>
                <FormField
                  name="email"
                  title="Email"
                  placeholder="Ваш email..."
                />

                <FormField
                  name="password"
                  title="Пароль"
                  placeholder="Ваш пароль..."
                />
              </FormProvider>
            </View>
          </View>

          <View className="flex gap-4">
            <ActionButton
              title="Войти"
              handlePress={methods.handleSubmit(onSubmit)}
              containerClassname="w-full"
              isLoading={isSubmitting}
            />

            <View className="flex flex-row justify-center gap-1">
              <Text className="font-pregular text-sm text-gray-100">
                Еще нет аккаунта?
              </Text>

              <Link
                disabled={isSubmitting}
                href={Routes.SIGN_UP}
                className="font-psemibold text-sm text-secondary"
              >
                Регистрация
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

