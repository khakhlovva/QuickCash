import { Redirect, usePathname } from 'expo-router';
import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import AddAmountModal from '~/components/AddAmountModal';
import AddOperationsModal from '~/components/AddOperationsModal';
import EditOperationsModal from '~/components/EditOperationsModal';
import OperationsContainer from '~/components/OperationsContainer';

import { Routes } from '~/constants/routes';

import { supabase } from '~/lib/supabase';

import { useAuth } from '~/context/AuthProvider';

export type OperationDataType = {
  operationId?: string;
  title: string;
  quantity: number;
};

const colors = ['#9C76A8', '#E9AAA7', '#C6EDE5', '#E3C0F5'];

const getCurrentMonth = () => {
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];
  return months[currentMonthIndex];
};

const Operations = () => {
  const { user } = useAuth();

  const path = usePathname();

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAddOperationsModalOpen, setIsAddOperationsModalOpen] =
    useState(false);
  const [isEditOperationsModalOpen, setIsEditOperationsModalOpen] =
    useState(false);
  const [isAddAmountModalOpen, setIsAddAmountModalModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [currentSectionDbName, setCurrentSectionDbName] = useState('');
  const [operationData, setOperationData] = useState<OperationDataType | null>(
    null
  );
  const [incomeSources, setIncomeSources] = useState<OperationDataType[]>([]);
  const [accounts, setAccounts] = useState<OperationDataType[]>([]);
  const [savings, setSavings] = useState<OperationDataType[]>([]);
  const [expenses, setExpenses] = useState<OperationDataType[]>([]);

  const currentMonthName = getCurrentMonth();

  const fetchOperations = async () => {
    if (!user?.id) return;

    setIsLoading(true);

    const [
      { data: incomeData, error: incomeError },
      { data: accountData, error: accountError },
      { data: expenseData, error: expenseError },
      { data: savingData, error: savingError },
    ] = await Promise.all([
      supabase.from('Income').select('*').eq('userId', user.id),
      supabase.from('Account').select('*').eq('userId', user.id),
      supabase.from('Expense').select('*').eq('userId', user.id),
      supabase.from('Saving').select('*').eq('userId', user.id),
    ]);

    if (incomeError || accountError || expenseError || savingError) {
      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2:
          'Произошла ошибка при попытке получить данные. Попробуйте еще раз',
      });

      return;
    }

    if (incomeData) {
      setIncomeSources(
        incomeData.map(income => ({
          operationId: income.id,
          title: income.title,
          quantity: income.quantity,
        }))
      );
    }

    if (accountData) {
      setAccounts(
        accountData.map(account => ({
          operationId: account.id,
          title: account.title,
          quantity: account.quantity,
        }))
      );
    }

    if (expenseData) {
      setExpenses(
        expenseData.map(expense => ({
          operationId: expense.id,
          title: expense.title,
          quantity: expense.quantity,
        }))
      );
    }

    if (savingData) {
      setSavings(
        savingData.map(saving => ({
          operationId: saving.id,
          title: saving.title,
          quantity: saving.quantity,
        }))
      );
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!user) return;

    fetchOperations();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAddSectionButtonPress = (
    sectionTitle: string,
    dbName: string
  ) => {
    setIsAddOperationsModalOpen(true);

    setCurrentSection(sectionTitle);
    setCurrentSectionDbName(dbName);
  };

  const handleAddSectionModalClose = () => {
    setIsAddOperationsModalOpen(false);

    setCurrentSection('');
    setCurrentSectionDbName('');
  };

  const handleAddNewOperation = (data: OperationDataType) => {
    switch (currentSectionDbName) {
      case 'Income':
        setIncomeSources(prev => [...prev, data]);

        break;
      case 'Account':
        setAccounts(prev => [...prev, data]);

        break;
      case 'Expense':
        setExpenses(prev => [...prev, data]);

        break;
      case 'Saving':
        setSavings(prev => [...prev, data]);

        break;
      default:
        break;
    }
  };

  const handleEditOperationsButtonPress = (
    dbName: string,
    data: OperationDataType
  ) => {
    setIsEditOperationsModalOpen(true);

    setOperationData(data);
    setCurrentSectionDbName(dbName);
  };

  const handleEditOperationsModalClose = () => {
    setIsEditOperationsModalOpen(false);

    setOperationData(null);
    setCurrentSectionDbName('');
  };

  const handleDeleteOperation = async (id: string) => {
    const { error } = await supabase
      .from(currentSectionDbName)
      .delete()
      .eq('id', id);

    if (!error) {
      Toast.show({
        type: 'success',
        text1: 'Успех',
        text2: `Секция ${operationData?.title} успешно удалена`,
      });

      switch (currentSectionDbName) {
        case 'Income':
          setIncomeSources(prev =>
            prev.filter(({ operationId }) => id !== operationId)
          );

          break;
        case 'Account':
          setAccounts(prev =>
            prev.filter(({ operationId }) => id !== operationId)
          );

          break;
        case 'Expense':
          setExpenses(prev =>
            prev.filter(({ operationId }) => id !== operationId)
          );

          break;
        case 'Saving':
          setSavings(prev =>
            prev.filter(({ operationId }) => id !== operationId)
          );

          break;
        default:
          break;
      }

      handleEditOperationsModalClose();
    } else {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: error.message || 'Произошла ошибка. Попробуйте еще раз',
      });
    }
  };

  const handleAddAmount = async (id: string, amount: number) => {
    const newAmount = (operationData?.quantity ?? 0) + amount;

    const { error } = await supabase
      .from(currentSectionDbName)
      .update({ quantity: newAmount })
      .eq('id', id);

    if (!error) {
      await supabase.from('Log').insert({
        operationType: currentSectionDbName.toUpperCase(),
        sectionName: operationData?.title,
        quantity: amount,
        updatedAt: new Date(),
        userId: user?.id,
      });

      Toast.show({
        type: 'success',
        text1: 'Успех',
        text2: `Сумма ${Math.abs(amount)} BYN успешно ${amount >= 0 ? 'внесена' : 'вычтена'}`,
      });

      switch (currentSectionDbName) {
        case 'Income':
          setIncomeSources(prev =>
            prev.map(value =>
              id === value.operationId
                ? { ...value, quantity: newAmount }
                : value
            )
          );

          break;
        case 'Account':
          setAccounts(prev =>
            prev.map(value =>
              id === value.operationId
                ? { ...value, quantity: newAmount }
                : value
            )
          );

          break;
        case 'Expense':
          setExpenses(prev =>
            prev.map(value =>
              id === value.operationId
                ? { ...value, quantity: newAmount }
                : value
            )
          );

          break;
        case 'Saving':
          setSavings(prev =>
            prev.map(value =>
              id === value.operationId
                ? { ...value, quantity: newAmount }
                : value
            )
          );

          break;
        default:
          break;
      }

      setIsAddAmountModalModalOpen(false);
    } else {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: 'Ошибка',
        text2: error.message || 'Произошла ошибка. Попробуйте еще раз',
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);

    await fetchOperations();

    setIsRefreshing(false);
  };

  useEffect(() => {
    if (path === Routes.OPERATIONS) {
      handleRefresh();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  if (!user) return <Redirect href={Routes.SIGN_IN} />;

  if (isLoading) {
    return (
      <View className="flex size-full items-center justify-center bg-primary">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="flex flex-row justify-between p-5">
          <Text className="text-center text-3xl font-bold color-white">
            Категории
          </Text>
          <Text className="text-center text-3xl font-bold color-white">
            {currentMonthName}
          </Text>
        </View>

        <OperationsContainer
          data={incomeSources}
          title="Источники дохода"
          dbName="Income"
          onButtonPress={handleAddSectionButtonPress}
          onOperationPress={handleEditOperationsButtonPress}
        />
        <OperationsContainer
          data={accounts}
          title="Счета"
          dbName="Account"
          onButtonPress={handleAddSectionButtonPress}
          onOperationPress={handleEditOperationsButtonPress}
        />
        <OperationsContainer
          data={expenses}
          title="Расходы"
          dbName="Expense"
          onButtonPress={handleAddSectionButtonPress}
          onOperationPress={handleEditOperationsButtonPress}
        />
        <OperationsContainer
          data={savings}
          title="Накопления"
          dbName="Saving"
          onButtonPress={handleAddSectionButtonPress}
          onOperationPress={handleEditOperationsButtonPress}
        />
      </ScrollView>

      <AddOperationsModal
        isModalVisible={isAddOperationsModalOpen}
        onModalClose={handleAddSectionModalClose}
        title={`Добавить секцию в ${currentSection.toLowerCase()}`}
        dbName={currentSectionDbName}
        userId={user.id}
        handleAddNewOperation={handleAddNewOperation}
      />

      <EditOperationsModal
        isModalVisible={isEditOperationsModalOpen}
        isAddAmountModalVisible={isAddAmountModalOpen}
        onModalClose={handleEditOperationsModalClose}
        dbName={currentSectionDbName}
        onOperationDelete={handleDeleteOperation}
        onOpenAddAmountModal={() => setIsAddAmountModalModalOpen(true)}
        onCloseAddAmountModal={() => setIsAddAmountModalModalOpen(false)}
        onAddAmount={handleAddAmount}
        {...operationData}
      />

      <AddAmountModal
        isModalVisible={isAddAmountModalOpen}
        onModalClose={() => setIsAddAmountModalModalOpen(false)}
        onAddAmount={handleAddAmount}
        {...operationData}
      />
    </SafeAreaView>
  );
};

export default Operations;

