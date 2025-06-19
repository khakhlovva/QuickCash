import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Keyboard, Modal, TouchableWithoutFeedback, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

import { OperationDataType } from '~/app/(tabs)/operations';

import { supabase } from '~/lib/supabase';

import ActionButton from './ActionButton';
import FormField from './FormField';
import { Text } from './ui/text';

interface AddOperationsModalProps {
  isModalVisible: boolean;
  onModalClose: () => void;
  title?: string;
  dbName: string;
  userId: string;
  handleAddNewOperation: (data: OperationDataType) => void;
}

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Название должно содержать минимум 2 символа')
    .max(32, 'Название может содержать максимум 32 символа'),
  quantity: z.coerce
    .number()
    .min(0, 'Сумма должна быть положительной')
    .optional()
    .default(0),
});

type AddOperationSchemaType = z.infer<typeof schema>;

const AddOperationsModal = ({
  isModalVisible,
  onModalClose,
  title,
  dbName,
  userId,
  handleAddNewOperation,
}: AddOperationsModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<AddOperationSchemaType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: AddOperationSchemaType) => {
    setIsSubmitting(true);

    const { title, quantity } = data;

    const { data: section, error } = await supabase
      .from(dbName)
      .insert({ title, quantity, userId, updatedAt: new Date() })
      .select();

    if (!error) {
      await supabase.from('Log').insert({
        operationType: dbName.toUpperCase(),
        sectionName: title,
        quantity,
        updatedAt: new Date(),
        userId,
      });

      Toast.show({
        type: 'success',
        text1: 'Успех',
        text2: 'Секция успешно добавлена',
      });

      handleAddNewOperation({
        operationId: section[0]?.id ?? '',
        title,
        quantity,
      });

      methods.reset();

      onModalClose();
    } else {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: error.message || 'Произошла ошибка. Попробуйте еще раз',
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={onModalClose}
    >
      <TouchableWithoutFeedback onPress={onModalClose}>
        <View className="absolute left-0 top-0 h-full w-full bg-black/75" />
      </TouchableWithoutFeedback>

      <View className="grow items-center justify-center">
        <View
          className="w-full max-w-80 items-center rounded-xl bg-white p-4"
          onTouchStart={Keyboard.dismiss}
        >
          <Text className="text-center font-pbold text-lg">{title}</Text>

          <View className="mt-2 w-full gap-6">
            <FormProvider {...methods}>
              <FormField
                name="title"
                title="Название"
                placeholder="Название секции"
              />

              <FormField
                name="quantity"
                title="Сумма"
                placeholder="Сумма"
                keyboardType="numeric"
              />
            </FormProvider>

            <View className="gap-3">
              <ActionButton
                title="Добавить"
                handlePress={methods.handleSubmit(onSubmit)}
                isLoading={isSubmitting}
              />

              <ActionButton
                title="Закрыть"
                handlePress={onModalClose}
                disabled={isSubmitting}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddOperationsModal;
