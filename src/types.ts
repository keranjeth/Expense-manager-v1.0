export interface Expense {
  id: string;
  date: Date;
  category: string;
  subcategory: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  recipient: string;
}

export interface Category {
  name: string;
  subcategories: string[];
}

export interface AppState {
  expenses: Expense[];
  categories: Category[];
  scriptUrl: string | null;
  setScriptUrl: (url: string) => void;
  addExpense: (expense: Expense) => void;
  removeExpense: (id: string) => void;
  addCategory: (category: string) => void;
  addSubcategory: (category: string, subcategory: string) => void;
}