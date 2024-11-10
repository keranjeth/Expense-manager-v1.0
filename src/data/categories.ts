interface Category {
  name: string;
  isDefault: boolean;
  subcategories: string[];
}

export const initialCategories: Category[] = [
  {
    name: 'Food',
    isDefault: true,
    subcategories: ['Groceries', 'Restaurants', 'Snacks']
  },
  {
    name: 'Transportation',
    isDefault: true,
    subcategories: ['Fuel', 'Public Transit', 'Maintenance']
  },
  {
    name: 'Utilities',
    isDefault: true,
    subcategories: ['Electricity', 'Water', 'Internet']
  }
];

export type { Category }; 