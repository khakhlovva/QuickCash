import { router, usePathname } from 'expo-router';
import { Image, Text, View } from 'react-native';

import { images } from '~/constants';
import { Routes } from '~/constants/routes';

import ActionButton from './ActionButton';

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

const EmptyState = ({ title, subtitle }: EmptyStateProps) => {
  const path = usePathname();

  return (
    <View className="flex items-center justify-center px-4">
      <Image
        source={images.Empty}
        resizeMode="contain"
        className="h-[216px] w-[270px]"
      />

      <Text className="font-pmedium text-sm text-gray-100">{title}</Text>

      <Text className="mt-2 text-center font-psemibold text-xl text-white">
        {subtitle}
      </Text>

      <ActionButton
        title="На страницу операций"
        handlePress={() =>
          router.push(
            path !== Routes.OPERATIONS ? Routes.OPERATIONS : Routes.PROFILE
          )
        }
        containerClassname="my-5 px-4"
      />
    </View>
  );
};

export default EmptyState;

