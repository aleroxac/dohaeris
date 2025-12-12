export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export type Currency = 'BRL' | 'USD' | 'GBP';

export interface CreditCard {
  id: string;
  name: string;
  defaultCashback: number;
  closingDay: number;
  dueDay: number;
  color?: string;
}

export interface TagBudget {
  tag: string;
  expectedAmount: number;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category?: string;
  subCategory?: string;
  status: 'PAID' | 'PENDING';
  dueDate?: string;
  paymentMethod: string; // 'CASH', 'PIX', 'DEBIT' or cardId
  tags: string[];
  cashbackAmount?: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: string; // New field for Item Category (e.g., Dairy, Cleaning)
  price: number;
  isBought: boolean;
}

export interface ShoppingTrip {
  id: string;
  name: string; // Establishment Name
  date: string;
  category: string; // Changed from union to string to support dynamic tabs (e.g. 'Pharmacy')
  items: ShoppingItem[];
}

export interface Goal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  deadline?: string;
  icon?: string;
}

export interface Asset {
  id: string;
  name: string;
  value: number;
  type: 'Bank' | 'Investment' | 'Crypto' | 'FGTS' | 'RealEstate' | 'Other';
}

export type ViewState = 'dashboard' | 'earnings' | 'expenses' | 'groceries' | 'goals' | 'patrimony' | 'profile';