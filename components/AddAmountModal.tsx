import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Keyboard, Modal, TouchableWithoutFeedback, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

import ActionButton from './ActionButton';
import FormField from './FormField';
import { Text } from './ui/text';

interface AddAmountModalProps {
  isModalVisible: boolean;
  onModalClose: () => void;
  operationId?: string;
  title?: string;
  quantity?: number;
  onAddAmount: (id: string, amount: number) => Promise<void>;
}

const schema = z.object({
  amount: z.coerce.number(),
});

type AddAmountModalSchemaType = z.infer<typeof schema>;

const AddAmountModal = ({
  isModalVisible,
  onModalClose,
  title,
  operationId,
  quantity = 0,
  onAddAmount,
}: AddAmountModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<AddAmountModalSchemaType>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ amount }: AddAmountModalSchemaType) => {
    if (!operationId) return;

    setIsSubmitting(true);

    await onAddAmount(operationId, amount);

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
          <Text className="text-center font-pbold text-lg">
            Внести сумму в секцию {title}
          </Text>

          <View className="mt-2 w-full gap-3">
            <FormProvider {...methods}>
              <Text className="font-pbold">Сумма в секции: {quantity}</Text>

              <FormField
                name="amount"
                title="Сумма"
                placeholder="Введите сумму"
                keyboardType="numbers-and-punctuation"
              />
            </FormProvider>

            <View className="mt-4 gap-3">
              <ActionButton
                title="Внести"
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

export default AddAmountModal;

