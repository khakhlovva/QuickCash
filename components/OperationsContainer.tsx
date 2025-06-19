import {
  Pressable,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';

import { OperationDataType } from '~/app/(tabs)/operations';

import { cn } from '~/lib/utils';

import OperationBox from './OperationsBox';
import { Button } from './ui/button';

interface OperationsContainerProps {
  title: string;
  dbName: string;
  data: OperationDataType[];
  containerClassname?: string;
  onButtonPress?: (title: string, dbName: string) => void;
  onOperationPress?: (dbName: string, data: OperationDataType) => void;
}

const colors = ['#9C76A8', '#E9AAA7', '#C6EDE5', '#E3C0F5'];

const OperationsContainer = ({
  title,
  dbName,
  data,
  containerClassname,
  onButtonPress,
  onOperationPress,
}: OperationsContainerProps) => {
  const getRandomColor = (previousColor: string | null) => {
    let newColor = null;
    do {
      newColor = colors[Math.floor(Math.random() * colors.length)] ?? null;
    } while (newColor === previousColor);
    return newColor;
  };

  let lastColor: string | null = null;

  const handleOperationPress = (data: OperationDataType) => {
    onOperationPress?.(dbName, data);
  };

  return (
    <View className={cn('px-4', containerClassname)}>
      <View className="flex flex-row items-center justify-between">
        <Text className="text-left text-2xl font-bold color-white">
          {title}
        </Text>

        <TouchableOpacity onPress={() => onButtonPress?.(title, dbName)}>
          <Text className="text-xl color-white">Добавить</Text>
        </TouchableOpacity>
      </View>

      <View className="flex flex-row flex-wrap py-4">
        {data.map((source, index) => {
          const color = getRandomColor(lastColor);
          lastColor = color;
          return (
            <OperationBox
              key={index}
              id={source.operationId}
              quantity={source.quantity}
              subtitle={source.title}
              backgroundColor={color}
              onOperationPress={handleOperationPress}
            />
          );
        })}
      </View>
    </View>
  );
};

export default OperationsContainer;
