import { router, usePathname } from 'expo-router';
import { useState } from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { icons } from '~/constants';

interface SearchInputProps {
  initialQuery?: string;
}

const SearchInput = ({ initialQuery }: SearchInputProps) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || '');

  return (
    <View className="flex h-16 w-full flex-row items-center space-x-4 rounded-2xl border-2 border-black-200 bg-black-100 px-4 focus:border-secondary">
      <TextInput
        className="mt-0.5 flex-1 font-pregular text-base text-white"
        value={query}
        placeholder="Search a video topic"
        placeholderTextColor="#CDCDE0"
        onChangeText={e => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (query === '')
            return Toast.show({
              type: 'error',
              text1: 'Missing Query',
              text2: 'Please input something to search results across database',
            });

          if (pathname.startsWith('/search')) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <Image
          source={icons.SearchIcon}
          className="h-5 w-5"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
