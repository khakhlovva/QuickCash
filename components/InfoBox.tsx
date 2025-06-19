import { Text, View } from 'react-native';

import { cn } from '~/lib/utils';

interface InfoBoxProps {
  title: string;
  subtitle?: string;
  containerClassname?: string;
  titleClassname?: string;
}

const InfoBox = ({
  title,
  subtitle,
  containerClassname,
  titleClassname,
}: InfoBoxProps) => {
  return (
    <View className={containerClassname}>
      <Text
        className={cn(
          'text-center font-psemibold text-xl text-white',
          titleClassname
        )}
      >
        {title}
      </Text>

      <Text className="text-center font-pregular text-sm text-gray-100">
        {subtitle}
      </Text>
    </View>
  );
};

export default InfoBox;

