import { cx } from 'class-variance-authority';
import { Image, Text, View } from 'react-native';

import { OperationToIconMapping, OperationType } from '~/types/log';

import { useAuth } from '~/context/AuthProvider';

interface LogCardProps {
  id: string;
  sectionName: string;
  operationType: OperationType;
  label: string;
  quantity: number;
  createdAt: Date;
}

const LogCard = ({
  id,
  sectionName,
  operationType,
  label,
  quantity,
  createdAt,
}: LogCardProps) => {
  return (
    <View className="mb-10 items-center px-4">
      <View className="flex flex-row items-start gap-3">
        <View className="flex flex-1 flex-row">
          <View
            className={cx(
              'flex size-10 items-center justify-center rounded-full',
              quantity >= 0 ? 'bg-green-600' : 'bg-red-600',
              operationType === OperationType.EXPENSE && 'bg-red-600'
            )}
          >
            <Image
              source={OperationToIconMapping[operationType]}
              className="size-7"
              resizeMode="cover"
              tintColor="#ffffff"
            />
          </View>

          <View className="ml-3 flex flex-1 justify-center gap-y-1">
            <Text
              className="font-psemibold text-lg text-white"
              numberOfLines={1}
            >
              {sectionName}
            </Text>

            <Text
              className="font-psemibold text-sm text-gray-100"
              numberOfLines={1}
            >
              {label}
            </Text>

            <Text
              className="font-pregular text-xs text-gray-100"
              numberOfLines={1}
            >
              {createdAt.toISOString()}
            </Text>
          </View>

          <View className="ml-auto">
            <Text
              className="font-psemibold text-xl text-white"
              numberOfLines={1}
            >
              {quantity >= 0 ? '+' : '-'} {Math.abs(quantity)} BYN
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LogCard;

