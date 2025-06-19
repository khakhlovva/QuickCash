import { Image, Text, View } from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';

import { icons } from '~/constants';

import { supabase } from '~/lib/supabase';

import { useAuth } from '~/context/AuthProvider';

interface CardMenuProps {
  id: string;
  isSaved: boolean;
  isDeletable: boolean;
  onDeleteFromSaved?: () => Promise<void>;
}

const CardMenu = ({
  id,
  isSaved,
  isDeletable,
  onDeleteFromSaved,
}: CardMenuProps) => {
  const { profile } = useAuth();

  const handleSavedAction = async () => {
    if (isSaved) {
      const { error: removeFromSavedError } = await supabase
        .from('saved_videos')
        .delete()
        .eq('video_id', id)
        .eq('profile_id', profile?.id);

      if (removeFromSavedError) {
        Toast.show({
          type: 'error',
          text1: 'Ошибка',
          text2:
            removeFromSavedError.message ||
            'Произошла ошибка. Пожалуйста, попробуйте снова',
        });

        return;
      }

      await onDeleteFromSaved?.();

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Video was removed from saved',
      });
    } else {
      const { error: insertIntoSavedError } = await supabase
        .from('saved_videos')
        .insert({
          video_id: id,
          profile_id: profile?.id,
        });

      if (insertIntoSavedError) {
        Toast.show({
          type: 'error',
          text1: 'Ошибка',
          text2:
            insertIntoSavedError.message ||
            'Произошла ошибка. Пожалуйста, попробуйте снова',
        });

        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Video was added into saved',
      });
    }
  };

  const handleDelete = async () => {
    const { error: deleteError } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (deleteError) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2:
          deleteError.message ||
          'Произошла ошибка. Пожалуйста, попробуйте снова',
      });

      return;
    }

    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Video was deleted from profile',
    });
  };

  return (
    <Menu>
      <MenuTrigger>
        <Image
          source={icons.MenuIcon}
          className="size-5"
          resizeMode="contain"
        />
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: {
            marginTop: 30,
            width: 112,
            borderRadius: 5,
            borderColor: '#232533',
            borderWidth: 1,
          },
        }}
        optionsContainerStyle={{ backgroundColor: '#1E1E2D' }}
      >
        <MenuOption
          customStyles={{
            optionWrapper: { paddingBlock: 8, paddingInline: 16 },
          }}
          onSelect={handleSavedAction}
        >
          <View className="flex flex-row items-center gap-2">
            <Image
              source={icons.BookmarkIcon}
              resizeMode="contain"
              className="!size-3"
            />

            <Text className="font-pmedium text-sm text-gray-100">
              {isSaved ? 'Remove' : 'Save'}
            </Text>
          </View>
        </MenuOption>

        {isDeletable && (
          <MenuOption
            customStyles={{
              optionWrapper: { paddingBlock: 8, paddingInline: 16 },
            }}
            onSelect={handleDelete}
          >
            <View className="flex flex-row items-center gap-2">
              <Image
                source={icons.DeleteIcon}
                resizeMode="contain"
                className="!size-[14px]"
              />

              <Text className="font-pmedium text-sm text-gray-100">Delete</Text>
            </View>
          </MenuOption>
        )}
      </MenuOptions>
    </Menu>
  );
};

export default CardMenu;

