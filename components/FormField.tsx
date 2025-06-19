import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  Image,
  Keyboard,
  Text,
  TextInput,
  type TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

import { icons } from '~/constants';

import { cn } from '~/lib/utils';

interface FormFieldProps extends TextInputProps {
  name: string;
  title?: string;
  placeholder?: string;
  containerClassname?: string;
}

const FormField = ({
  name,
  title,
  placeholder,
  containerClassname,
  className,
  ...props
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { control } = useFormContext();

  return (
    <>
      <Controller
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View className={cn('flex gap-2', containerClassname)}>
            {title && (
              <Text className="font-pmedium text-base text-gray-100">
                {title}
              </Text>
            )}

            <View
              className={cn(
                'flex h-16 w-full flex-row items-center rounded-2xl border-2 border-black-200 bg-black-100 px-4',
                isFocused && !error && 'border-secondary',
                error && 'border-red-500'
              )}
            >
              <TextInput
                className={cn(
                  'flex-1 font-psemibold text-base text-white',
                  className
                )}
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#7B7B8B"
                onChangeText={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                secureTextEntry={name === 'password' && !showPassword}
                {...props}
              />

              {name === 'password' && (
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Image
                    source={showPassword ? icons.EyeHideIcon : icons.EyeIcon}
                    className="h-6 w-6"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )}
            </View>

            {error && <Text className="text-red-500">{error.message}</Text>}
          </View>
        )}
        name={name}
      />
    </>
  );
};

export default FormField;

