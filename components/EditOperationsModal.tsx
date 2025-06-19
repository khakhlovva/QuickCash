import { useState } from 'react';
import { Keyboard, Modal, TouchableWithoutFeedback, View } from 'react-native';
import Toast from 'react-native-toast-message';

import ActionButton from './ActionButton';
import AddAmountModal from './AddAmountModal';
import { Text } from './ui/text';

interface EditOperationsModalProps {
  isModalVisible: boolean;
  isAddAmountModalVisible: boolean;
  onModalClose: () => void;
  onOperationDelete: (id: string) => Promise<void>;
  onCloseAddAmountModal: () => void;
  onOpenAddAmountModal: () => void;
  onAddAmount: (id: string, amount: number) => Promise<void>;
  dbName: string;
  operationId?: string;
  title?: string;
  quantity?: number;
}

const EditOperationsModal = ({
  isModalVisible,
  isAddAmountModalVisible,
  onModalClose,
  onOperationDelete,
  onCloseAddAmountModal,
  onOpenAddAmountModal,
  onAddAmount,
  operationId,
  title,
  quantity,
}: EditOperationsModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteOperation = async (id: string) => {
    setIsDeleting(true);

    await onOperationDelete(id);

    setIsDeleting(false);
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
          <Text className="text-center font-pbold text-lg">Секция {title}</Text>

          <View className="mt-4 w-full gap-6">
            <View className="gap-3">
              <ActionButton
                title="Внести сумму"
                handlePress={onOpenAddAmountModal}
                disabled={isDeleting}
              />

              <ActionButton
                title="Удалить"
                handlePress={() => handleDeleteOperation(operationId ?? '')}
                isLoading={isDeleting}
              />

              <ActionButton
                title="Закрыть"
                handlePress={onModalClose}
                disabled={isDeleting}
              />
            </View>
          </View>
        </View>
      </View>

      <AddAmountModal
        isModalVisible={isAddAmountModalVisible}
        onModalClose={onCloseAddAmountModal}
        onAddAmount={onAddAmount}
        title={title}
        quantity={quantity}
        operationId={operationId}
      />

      <Toast />
    </Modal>
  );
};

export default EditOperationsModal;
