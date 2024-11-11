import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Category {
  name: string;
  subcategories: string[];
  isDefault: boolean;
}

interface Expense {
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

interface Store {
  categories: Category[];
  expenses: Expense[];
  scriptUrl: string | null;
  addCategory: (name: string) => void;
  removeCategory: (name: string) => void;
  addSubcategory: (categoryName: string, subcategoryName: string) => void;
  addExpense: (expense: Expense) => void;
  removeExpense: (id: string) => void;
  setScriptUrl: (url: string) => void;
}

const initialCategories: Category[] = [
  { name: "Food", subcategories: ["Groceries", "Dining Out", "Fruits", "Vegetables", "Beverages"], isDefault: true },
  { name: "Housing", subcategories: ["Rent", "Home Maintenance", "Furniture", "Household Supplies", "Dishes", "Miscellaneous"], isDefault: true },
  { name: "Utilities", subcategories: ["Electricity", "Water", "Gas", "Internet"], isDefault: true },
  { name: "Transportation", subcategories: ["Car Rental", "Bus Ticket", "Flight Ticket", "Taxi"], isDefault: true },
  { name: "Health", subcategories: ["Medicine", "Hospital", "Dental", "Eye Care", "Medical Supplies"], isDefault: true },
  { name: "Education", subcategories: ["School Fees", "University Fees", "Books", "Stationery", "Courses"], isDefault: true },
  { name: "Leisure", subcategories: ["Travel", "Entertainment", "Sports Equipment", "Gym Membership", "Games"], isDefault: true },
  { name: "Family and Social Obligations", subcategories: ["Family Expenses", "Relative Expenses"], isDefault: true },
  { name: "Personal Care", subcategories: ["Beauty Salon", "Hygiene Products", "Beauty Products", "Barber"], isDefault: true },
  { name: "Debt", subcategories: ["Loan Payment"], isDefault: true },
  { name: "Special Occasions", subcategories: ["Birthday Gifts", "Wedding Gifts", "Visitation Gifts", "Celebrations"], isDefault: true },
  { name: "Charity and Donations", subcategories: ["Charity", "Helping the Needy", "Community Center"], isDefault: true }
];

export const useStore = create<Store>()(
  persist(
    (set) => ({
      categories: initialCategories,
      expenses: [],
      scriptUrl: null,
      addCategory: (name) =>
        set((state) => ({
          categories: [...state.categories, { name, subcategories: [], isDefault: false }],
        })),
      addSubcategory: (categoryName, subcategoryName) =>
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.name === categoryName
              ? {
                  ...cat,
                  subcategories: [...cat.subcategories, subcategoryName],
                }
              : cat
          ),
        })),
      addExpense: (expense) =>
        set((state) => ({
          expenses: [...state.expenses, expense],
        })),
      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),
      setScriptUrl: (url) =>
        set(() => ({
          scriptUrl: url,
        })),
      removeCategory: (name) =>
        set((state) => {
          const categoryToRemove = state.categories.find(cat => cat.name === name);
          if (categoryToRemove?.isDefault) {
            return state;
          }
          return {
            categories: state.categories.filter((cat) => cat.name !== name),
            expenses: state.expenses.filter((exp) => exp.category !== name),
          };
        }),
    }),
    {
      name: 'expense-store',
    }
  )
);