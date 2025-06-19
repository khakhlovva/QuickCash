import {
  ActivityIndicator,
  type GestureResponderEvent,
  Text,
  TouchableOpacity,
} from 'react-native';

import { cn } from '~/lib/utils';

interface ActionButtonProps {
  title: string;
  handlePress: (event: GestureResponderEvent) => void;
  containerClassname?: string;
  textClassname?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const ActionButton = ({
  title,
  handlePress,
  containerClassname,
  textClassname,
  isLoading,
  disabled,
}: ActionButtonProps) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={cn(
        'flex min-h-[62px] flex-row items-center justify-center rounded-xl bg-secondary',
        isLoading && 'opacity-50',
        containerClassname
      )}
      disabled={disabled || isLoading}
    >
      <Text
        className={cn('font-psemibold text-lg text-primary', textClassname)}
      >
        {title}
      </Text>

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          size="small"
          className="ml-2 text-white"
        />
      )}
    </TouchableOpacity>
  );
};

export default ActionButton;

