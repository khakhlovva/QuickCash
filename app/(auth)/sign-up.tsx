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

import type { SignUpParams } from '~/types/auth';

import { supabase } from '~/lib/supabase';

import { signUpSchema } from '~/schemas/auth';

AppState.addEventListener('change', state => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<SignUpParams>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpParams) => {
    setIsSubmitting(true);

    const { email, password, username } = data;

    const {
      error,
      data: { user },
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2:
          error.message || 'Произошла ошибка. Пожалуйста, попробуйте снова',
      });
    }

    const { error: userCreateError } = await supabase
      .from('User')
      .insert({ id: user?.id, email, username, updatedAt: new Date() });

    if (userCreateError) {
      console.log(userCreateError);
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: 'Произошла ошибка. Пожалуйста, попробуйте снова',
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Успешно',
        text2: 'Вы успешно зарегистрировались',
      });

      router.replace(Routes.OPERATIONS);
    }

    setIsSubmitting(false);
  };

  return (
    <SafeAreaView className="size-full bg-primary">
      <ScrollView contentContainerClassName="h-full">
        <View className="flex h-full w-full gap-8 px-8 pt-14">
          <View className="mt-5 flex gap-12">
            <Text className="font-psemibold text-2xl text-white">
              Регистрация
            </Text>

            <View className="flex gap-6">
              <FormProvider {...methods}>
                <FormField
                  name="username"
                  title="Имя пользователя"
                  placeholder="Ваше имя пользователя..."
                />

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

              <View className="flex flex-row justify-center gap-1">
                <Text className="font-pregular text-sm text-gray-100">
                  Уже есть аккаунт?
                </Text>

                <Link
                  disabled={isSubmitting}
                  href={Routes.SIGN_IN}
                  className="font-psemibold text-sm text-secondary"
                >
                  Войти
                </Link>
              </View>
            </View>
          </View>

          <View className="flex gap-4">
            <ActionButton
              title="Зарегистрироваться"
              handlePress={methods.handleSubmit(onSubmit)}
              containerClassname="w-full"
              isLoading={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

