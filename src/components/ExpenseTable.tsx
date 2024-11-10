import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '../store';
import { formatCurrency } from '../utils/format';

export const ExpenseTable: React.FC = () => {
  const { expenses, removeExpense } = useStore();
  const [showAll, setShowAll] = useState(false);

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Sort expenses by date (most recent first) and get the appropriate slice
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const displayedExpenses = showAll ? sortedExpenses : sortedExpenses.slice(0, 5);

  return (
    <div className="px-4 pb-4">
      <table className="w-full divide-y divide-gray-200/10">
        <thead>
          <tr className="grid grid-cols-[0.8fr_1.3fr_1.3fr_0.5fr_0.7fr_0.7fr_1.2fr_1.8fr_60px] gap-1">
            <th className="py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
            <th className="py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
            <th className="py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Subcategory</th>
            <th className="py-2 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
            <th className="py-2 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Unit Price</th>
            <th className="py-2 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Total Amount</th>
            <th className="py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Consumer</th>
            <th className="py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
            <th className="py-2 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200/10">
          {displayedExpenses.map((expense) => (
            <tr key={expense.id} className="grid grid-cols-[0.8fr_1.3fr_1.3fr_0.5fr_0.7fr_0.7fr_1.2fr_1.8fr_60px] gap-1 hover:bg-white/10">
              <td className="py-2 whitespace-nowrap text-sm text-gray-100 text-left">
                {formatDate(expense.date)}
              </td>
              <td className="py-2 whitespace-nowrap text-sm text-gray-100 text-left">
                {expense.category}
              </td>
              <td className="py-2 whitespace-nowrap text-sm text-gray-100 text-left">
                {expense.subcategory}
              </td>
              <td className="py-2 whitespace-nowrap text-sm text-gray-100 text-center">
                {expense.quantity}
              </td>
              <td className="py-2 whitespace-nowrap text-sm text-gray-100 text-center">
                {formatCurrency(expense.unitPrice)}
              </td>
              <td className="py-2 whitespace-nowrap text-sm text-gray-100 text-center">
                {formatCurrency(expense.totalAmount)}
              </td>
              <td className="py-2 whitespace-nowrap text-sm text-gray-100 text-left">
                {expense.recipient}
              </td>
              <td className="py-2 whitespace-nowrap text-sm text-gray-100 text-left">
                {expense.description}
              </td>
              <td className="py-2 whitespace-nowrap text-center px-2">
                <button
                  onClick={() => removeExpense(expense.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update See More/Less button styling */}
      {expenses.length > 5 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp size={16} />
              </>
            ) : (
              <>
                See More <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};