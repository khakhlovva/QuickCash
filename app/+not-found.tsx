import { Link, Stack } from 'expo-router';
import { View } from 'react-native';

import { Text } from '~/components/ui/text';

import { Routes } from '~/constants/routes';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Упс!' }} />

      <View>
        <Text>Данной страницы не существует.</Text>

        <Link href={Routes.OPERATIONS}>
          <Text>Вернуться на страницу операций</Text>
        </Link>
      </View>
    </>
  );
}

