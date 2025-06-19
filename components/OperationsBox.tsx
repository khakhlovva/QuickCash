import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { OperationDataType } from '~/app/(tabs)/operations';

interface OperationBoxProps {
  id?: string;
  quantity: number;
  subtitle: string;
  icon?: React.ReactNode;
  backgroundColor: string | null;
  onOperationPress?: (data: OperationDataType) => void;
}

const OperationBox = ({
  quantity,
  subtitle,
  icon,
  backgroundColor,
  onOperationPress,
  id = '',
}: OperationBoxProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, backgroundColor ? { backgroundColor } : {}]}
      onPress={() => {
        onOperationPress?.({
          operationId: id,
          title: subtitle,
          quantity,
        });
      }}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.quantity}>{quantity} BYN</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    margin: 8,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  quantity: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 12,
    color: '#3d3f3d',
  },
});

export default OperationBox;
