import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Minus, Trash2 } from 'lucide-react';
import { Combobox } from '@headlessui/react';
import { formatCurrency } from '../utils/format';
import { useStore } from '../store';
import toast from 'react-hot-toast';
import "react-datepicker/dist/react-datepicker.css";

interface ExpenseEntry {
  date: Date;
  category: string;
  subcategory: string;
  description: string;
  quantity: number;
  unitPrice: number;
  recipient: string;
}

const initialEntry = {
  date: new Date(),
  category: '',
  subcategory: '',
  description: '',
  quantity: 1,
  unitPrice: 0,
  recipient: ''
};

const isValidCategory = (category: string) => {
  // Minimum 3 characters, no special characters except spaces and hyphens
  const isValid = category.length >= 3 && /^[a-zA-Z0-9\s-]+$/.test(category);
  if (!isValid) {
    toast.error('Category name must be at least 3 characters long and contain only letters, numbers, spaces, and hyphens');
  }
  return isValid;
};

// Add validation for subcategories
const isValidSubcategory = (subcategory: string) => {
  const isValid = subcategory.length >= 2 && /^[a-zA-Z0-9\s-]+$/.test(subcategory);
  if (!isValid) {
    toast.error('Subcategory name must be at least 2 characters long and contain only letters, numbers, spaces, and hyphens');
  }
  return isValid;
};

export const ExpenseForm: React.FC = () => {
  const { categories, addCategory, removeCategory, addSubcategory, addExpense, scriptUrl } = useStore();
  const [entries, setEntries] = useState<ExpenseEntry[]>([{ ...initialEntry }]);
  const [categoryQuery, setCategoryQuery] = useState('');
  const [subcategoryQuery, setSubcategoryQuery] = useState('');

  const filteredCategories = React.useMemo(() => {
    return categoryQuery === ''
      ? categories
      : categories.filter((cat) =>
          cat.name.toLowerCase().includes(categoryQuery.toLowerCase())
        );
  }, [categories, categoryQuery]);

  const getFilteredSubcategories = React.useCallback((categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName);
    if (!category) return [];
    
    return subcategoryQuery === ''
      ? category.subcategories
      : category.subcategories.filter((sub) =>
          sub.toLowerCase().includes(subcategoryQuery.toLowerCase())
        );
  }, [categories, subcategoryQuery]);

  const handleAddEntry = () => {
    setEntries([...entries, { ...initialEntry }]);
  };

  const handleRemoveEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleEntryChange = (index: number, field: keyof ExpenseEntry, value: any) => {
    const newEntries = [...entries];
    newEntries[index] = { 
      ...newEntries[index], 
      [field]: value,
      ...(field === 'category' ? { subcategory: '' } : {})
    };
    setEntries(newEntries);
  };

  const saveToGoogleSheets = async (expense: any) => {
    if (!scriptUrl) {
      toast.error('Please configure Google Apps Script URL in settings first');
      return false;
    }

    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        throw new Error('Failed to save to Google Sheets');
      }

      return true;
    } catch (error) {
      console.error('Error saving to Google Sheets:', error);
      toast.error('Failed to save to Google Sheets');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    for (const entry of entries) {
      const totalAmount = entry.quantity * entry.unitPrice;
      const expense = {
        id: Date.now().toString(),
        ...entry,
        totalAmount,
      };

      const savedToSheets = await saveToGoogleSheets(expense);
      if (savedToSheets) {
        addExpense(expense);
        toast.success('Expense saved successfully');
      }
    }

    setEntries([{ ...initialEntry }]);
  };

  const handleRemoveCategory = (categoryName: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Prevent event bubbling

    // Check if it's a default category
    const isDefaultCategory = categories.find(
      cat => cat.name === categoryName && cat.isDefault
    );

    if (isDefaultCategory) {
      toast.error("Cannot remove default categories");
      return;
    }

    // Show confirmation dialog
    if (window.confirm(`Are you sure you want to remove the category "${categoryName}"?`)) {
      removeCategory(categoryName);
      toast.success(`Category "${categoryName}" removed successfully`);
    }
  };

  const handleRemoveSubcategory = (categoryName: string, subcategoryName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const category = categories.find(cat => cat.name === categoryName);
    if (category?.isDefault && category.subcategories.includes(subcategoryName)) {
      toast.error("Cannot remove default subcategories");
      return;
    }

    if (window.confirm(`Are you sure you want to remove the subcategory "${subcategoryName}"?`)) {
      const updatedCategories = categories.map(cat => {
        if (cat.name === categoryName) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter(sub => sub !== subcategoryName)
          };
        }
        return cat;
      });
      useStore.setState({ categories: updatedCategories });
      toast.success(`Subcategory "${subcategoryName}" removed successfully`);
    }
  };

  const handleAddSubcategory = (categoryName: string, newSubcategory: string, index: number) => {
    if (isValidSubcategory(newSubcategory)) {
      if (window.confirm(`Are you sure you want to add "${newSubcategory}" as a new subcategory to "${categoryName}"?`)) {
        addSubcategory(categoryName, newSubcategory);
        handleEntryChange(index, 'subcategory', newSubcategory);
        setSubcategoryQuery('');
        toast.success(`Subcategory "${newSubcategory}" added successfully`);
      }
    }
  };

  return (
    <div>
      {/* Title with separator line */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Enter Expenses</h2>
        <div className="mt-2 h-px bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-transparent shadow-sm"></div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Table Headers */}
        <div className="hidden lg:grid lg:grid-cols-[0.8fr_1.3fr_1.3fr_0.5fr_0.7fr_0.7fr_1.2fr_1.8fr_60px] gap-1 mb-2 px-4 text-sm font-medium text-white text-right">
          <div className="text-left">Date</div>
          <div className="text-left">Category</div>
          <div className="text-left">Subcategory</div>
          <div className="text-center">Quantity</div>
          <div className="text-center">Unit Price</div>
          <div className="text-center">Total Amount</div>
          <div className="text-left">Consumer</div>
          <div className="text-left">Description</div>
          <div className="text-center w-10">Action</div>
        </div>

        {/* Entries */}
        {entries.map((entry, index) => (
          <div key={index} className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.3fr_1.3fr_0.5fr_0.7fr_0.7fr_1.2fr_1.8fr_60px] gap-1">
              {/* Date */}
              <div className="space-y-1 lg:space-y-0">
                <label className="block lg:hidden text-sm font-medium text-gray-700">Date</label>
                <DatePicker
                  selected={entry.date}
                  onChange={(date: Date) => handleEntryChange(index, 'date', date)}
                  dateFormat="d-MMM-yyyy"
                  className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              {/* Category */}
              <div className="space-y-1 lg:space-y-0">
                <label className="block lg:hidden text-sm font-medium text-gray-700">Category</label>
                <Combobox
                  value={entry.category}
                  onChange={(value) => {
                    handleEntryChange(index, 'category', value);
                    setSubcategoryQuery('');
                  }}
                >
                  <div className="relative">
                    <Combobox.Input
                      className={`w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 ${
                        !entry.category ? 'text-gray-500' : 'text-gray-900'
                      }`}
                      onChange={(event) => setCategoryQuery(event.target.value)}
                      displayValue={() => entry.category}
                      placeholder="Select a category"
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Combobox.Button>
                    <Combobox.Options 
                      className="absolute z-10 w-full py-1 mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto"
                    >
                      {filteredCategories.map((cat) => (
                        <Combobox.Option
                          key={cat.name}
                          value={cat.name}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                              active ? 'bg-pink-100 text-pink-900' : 'text-gray-900'
                            }`
                          }
                        >
                          {({ active, selected }) => (
                            <div className="flex justify-between items-center">
                              <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                {cat.name}
                              </span>
                              <div className="flex items-center">
                                {selected && (
                                  <span
                                    className={`flex items-center pr-4 ${
                                      active ? 'text-pink-900' : 'text-pink-600'
                                    }`}
                                  >
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                )}
                                {cat.isDefault === false && (
                                  <button
                                    type="button"
                                    onClick={(e) => handleRemoveCategory(cat.name, e)}
                                    className={`ml-2 p-1 rounded-full hover:bg-pink-100 ${
                                      active ? 'text-pink-900' : 'text-pink-600'
                                    }`}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </Combobox.Option>
                      ))}
                      
                      {categoryQuery && !filteredCategories.find(cat => 
                        cat.name.toLowerCase() === categoryQuery.toLowerCase()
                      ) && (
                        <Combobox.Option
                          value={categoryQuery}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                              active ? 'bg-pink-100 text-pink-900' : 'text-gray-900'
                            } border-t border-gray-100`
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            if (isValidCategory(categoryQuery)) {
                              if (window.confirm(`Are you sure you want to add "${categoryQuery}" as a new category?`)) {
                                addCategory(categoryQuery);
                                handleEntryChange(index, 'category', categoryQuery);
                                setCategoryQuery('');
                                toast.success(`Category "${categoryQuery}" added successfully`);
                              }
                            }
                          }}
                        >
                          {({ active }) => (
                            <div className="flex items-center">
                              <svg
                                className={`mr-2 h-5 w-5 ${active ? 'text-pink-900' : 'text-pink-600'}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              <span>Add "{categoryQuery}" as new category</span>
                            </div>
                          )}
                        </Combobox.Option>
                      )}
                    </Combobox.Options>
                  </div>
                </Combobox>
              </div>

              {/* Subcategory */}
              <div className="space-y-1 lg:space-y-0">
                <label className="block lg:hidden text-sm font-medium text-gray-700">Subcategory</label>
                <Combobox
                  value={entry.subcategory}
                  onChange={(value) => handleEntryChange(index, 'subcategory', value)}
                  disabled={!entry.category}
                >
                  <div className="relative">
                    <Combobox.Input
                      className={`w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 ${
                        !entry.subcategory ? 'text-gray-500' : 'text-gray-900'
                      }`}
                      onChange={(event) => setSubcategoryQuery(event.target.value)}
                      displayValue={() => entry.subcategory}
                      placeholder={entry.category ? "Select a subcategory" : "Select a category first"}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center px-2">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Combobox.Button>
                    <Combobox.Options 
                      className="absolute z-10 w-full py-1 mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto"
                    >
                      {entry.category && getFilteredSubcategories(entry.category).map((sub) => (
                        <Combobox.Option
                          key={sub}
                          value={sub}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                              active ? 'bg-pink-100 text-pink-900' : 'text-gray-900'
                            }`
                          }
                        >
                          {({ active, selected }) => {
                            // Find the current category
                            const currentCategory = categories.find(cat => cat.name === entry.category);
                            // Check if this is a default subcategory
                            const isDefaultSubcategory = currentCategory?.isDefault && 
                              currentCategory.subcategories.includes(sub);

                            return (
                              <div className="flex justify-between items-center">
                                <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                  {sub}
                                </span>
                                <div className="flex items-center">
                                  {selected && (
                                    <span className={`flex items-center pr-4 ${active ? 'text-pink-900' : 'text-pink-600'}`}>
                                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                  )}
                                  {!isDefaultSubcategory && (
                                    <button
                                      type="button"
                                      onClick={(e) => handleRemoveSubcategory(entry.category, sub, e)}
                                      className={`ml-2 p-1 rounded-full hover:bg-pink-100 ${
                                        active ? 'text-pink-900' : 'text-pink-600'
                                      }`}
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          }}
                        </Combobox.Option>
                      ))}
                      
                      {entry.category && subcategoryQuery && !getFilteredSubcategories(entry.category).includes(subcategoryQuery) && (
                        <Combobox.Option
                          value={subcategoryQuery}
                          className={({ active }) =>
                            `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                              active ? 'bg-pink-100 text-pink-900' : 'text-gray-900'
                            } border-t border-gray-100`
                          }
                          onClick={() => handleAddSubcategory(entry.category, subcategoryQuery, index)}
                        >
                          {({ active }) => (
                            <div className="flex items-center">
                              <svg
                                className={`mr-2 h-5 w-5 ${active ? 'text-pink-900' : 'text-pink-600'}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              <span>Add "{subcategoryQuery}" as new subcategory</span>
                            </div>
                          )}
                        </Combobox.Option>
                      )}
                    </Combobox.Options>
                  </div>
                </Combobox>
              </div>

              {/* Quantity */}
              <div className="space-y-1 lg:space-y-0">
                <label className="block lg:hidden text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="text"
                  value={entry.quantity}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    handleEntryChange(index, 'quantity', value ? parseInt(value) : 1);
                  }}
                  onFocus={(e) => {
                    const input = e.target as HTMLInputElement;
                    input.value = entry.quantity.toString();
                    // Set cursor to the end
                    requestAnimationFrame(() => {
                      input.selectionStart = input.value.length;
                      input.selectionEnd = input.value.length;
                    });
                  }}
                  onBlur={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    handleEntryChange(index, 'quantity', value);
                    e.target.value = value.toString();
                  }}
                  onClick={(e) => {
                    const input = e.target as HTMLInputElement;
                    input.selectionStart = input.value.length;
                    input.selectionEnd = input.value.length;
                  }}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 text-right dir-rtl"
                />
              </div>

              {/* Unit Price */}
              <div className="space-y-1 lg:space-y-0">
                <label className="block lg:hidden text-sm font-medium text-gray-700">Unit Price</label>
                <input
                  type="text"
                  value={`${formatCurrency(entry.unitPrice)} ؋`}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    handleEntryChange(index, 'unitPrice', value ? parseInt(value) : 0);
                  }}
                  onFocus={(e) => {
                    const input = e.target as HTMLInputElement;
                    input.value = entry.unitPrice.toString();
                    // Set cursor to the end
                    requestAnimationFrame(() => {
                      input.selectionStart = input.value.length;
                      input.selectionEnd = input.value.length;
                    });
                  }}
                  onBlur={(e) => {
                    e.target.value = `${formatCurrency(entry.unitPrice)} ؋`;
                  }}
                  onClick={(e) => {
                    const input = e.target as HTMLInputElement;
                    input.selectionStart = input.value.length;
                    input.selectionEnd = input.value.length;
                  }}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 text-right dir-rtl"
                />
              </div>

              {/* Total Amount */}
              <div className="space-y-1 lg:space-y-0">
                <label className="block lg:hidden text-sm font-medium text-gray-700">Total</label>
                <input
                  type="text"
                  value={`${formatCurrency(entry.quantity * entry.unitPrice)} ؋`}
                  readOnly
                  className="w-full h-10 px-3 border border-gray-300 rounded-md bg-gray-50 text-right"
                />
              </div>

              {/* Consumer */}
              <div className="space-y-1 lg:space-y-0">
                <label className="block lg:hidden text-sm font-medium text-gray-700">Consumer</label>
                <input
                  type="text"
                  value={entry.recipient}
                  onChange={(e) => handleEntryChange(index, 'recipient', e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter consumer name"
                />
              </div>

              {/* Description */}
              <div className="space-y-1 lg:space-y-0">
                <label className="block lg:hidden text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  value={entry.description}
                  onChange={(e) => handleEntryChange(index, 'description', e.target.value)}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Enter description"
                />
              </div>

              {/* Update the Remove Entry Button container */}
              <div className="flex items-center justify-center w-10">
                <button
                  type="button"
                  onClick={() => handleRemoveEntry(index)}
                  className="text-white hover:text-pink-200 w-8 h-8 flex items-center justify-center"
                  title="Remove Entry"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={handleAddEntry}
            className="px-4 py-2 text-pink-500 border border-pink-500 rounded-md hover:bg-pink-50"
          >
            Add Entry
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600 transform transition-all duration-200 hover:scale-105"
          >
            Save Expenses
          </button>
        </div>
      </form>
    </div>
  );
};