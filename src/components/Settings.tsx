import React, { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { useStore } from '../store';

export const Settings: React.FC = () => {
  const { scriptUrl, setScriptUrl } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState(scriptUrl || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScriptUrl(url);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-pink-300 hover:text-pink-400 transition-colors flex items-center gap-2"
      >
        <SettingsIcon size={24} />
        <span className="text-sm font-medium">Settings</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Google Apps Script Web App URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="mt-1 block w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                    placeholder="https://script.google.com/..."
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};