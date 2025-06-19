import { icons } from '~/constants';

export enum OperationType {
  INCOME = 'INCOME',
  ACCOUNT = 'ACCOUNT',
  EXPENSE = 'EXPENSE',
  SAVING = 'SAVING',
}

export const OperationTypeLabels = {
  [OperationType.INCOME]: 'Доходы',
  [OperationType.ACCOUNT]: 'Счета',
  [OperationType.EXPENSE]: 'Траты',
  [OperationType.SAVING]: 'Накопления',
};

export const OperationToIconMapping = {
  [OperationType.INCOME]: icons.IncomeIcon,
  [OperationType.ACCOUNT]: icons.AccountsIcon,
  [OperationType.EXPENSE]: icons.ExpenseIcon,
  [OperationType.SAVING]: icons.SavingsIcon,
};

export type Log = {
  id: string;
  sectionName: string;
  operationType: string;
  quantity: string;
  createdAt: string;
  updatedAt: string | null;
  userId: string;
};

