import { Redirect, Tabs } from 'expo-router';
import { Image } from 'react-native';

import { icons } from '~/constants';
import { Routes } from '~/constants/routes';

import { useAuth } from '~/context/AuthProvider';

const TabsLayout = () => {
  const { user } = useAuth();

  if (!user) return <Redirect href={Routes.SIGN_IN} />;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FFA001',
          tabBarInactiveTintColor: '#CDCDE0',
          tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="operations"
          options={{
            title: 'Категории',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Image
                source={icons.HomeIcon}
                resizeMode="contain"
                tintColor={color}
                className="!h-6 !w-6"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Профиль',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Image
                source={icons.ProfileIcon}
                resizeMode="contain"
                tintColor={color}
                className="!h-6 !w-6"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="history"
          options={{
            title: 'История',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Image
                source={icons.HistoryIcon}
                resizeMode="contain"
                tintColor={color}
                className="!h-7 !w-7"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="statistics"
          options={{
            title: 'Статистика',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Image
                source={icons.StatisticsIcon}
                resizeMode="contain"
                tintColor={color}
                className="!h-7 !w-7"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="scan"
          options={{
            title: 'Скан',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Image
                source={icons.ScanIcon}
                resizeMode="contain"
                tintColor={color}
                className="!h-9 !w-9"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="search/[query]"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;

