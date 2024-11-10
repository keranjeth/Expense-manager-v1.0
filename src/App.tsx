import { Toaster } from 'react-hot-toast';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseTable } from './components/ExpenseTable';
import { Settings } from './components/Settings';
import { Coins } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
      {/* Sticky Header - removed background color to blend with theme */}
      <header className="sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Coins className="text-pink-400 w-8 h-8" />
                <h1 className="text-2xl font-bold text-white">Save Penny</h1>
              </div>
              <Settings />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Expense Entry Form */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
            <ExpenseForm />
          </div>
          
          {/* Recent Expenses Table */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white">Recent Expenses</h2>
              <div className="mt-2 h-px bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-transparent shadow-sm"></div>
            </div>
            <ExpenseTable />
          </div>
        </div>
      </div>

      <Toaster position="bottom-right" />
    </div>
  );
}