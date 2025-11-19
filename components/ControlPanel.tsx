
import React from 'react';
import type { Theme } from '../types';

interface ControlPanelProps {
  themes: Theme[];
  cardCounts: number[];
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  customThemeText?: string;
  onCustomThemeTextChange?: (text: string) => void;
  numCards: number;
  onNumCardsChange: (count: number) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  themes,
  cardCounts,
  selectedTheme,
  onThemeChange,
  customThemeText,
  onCustomThemeTextChange,
  numCards,
  onNumCardsChange,
  onGenerate,
  isLoading,
}) => {
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const theme = themes.find(t => t.value === e.target.value);
    if (theme) {
      onThemeChange(theme);
    }
  };

  const handleNumCardsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onNumCardsChange(parseInt(e.target.value, 10));
  };
  
  const isComplexTheme = selectedTheme.value === 'complex_conundrums';
  const isCustomTheme = selectedTheme.value === 'custom';

  return (
    <div className="sticky top-0 z-10 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md p-4 mb-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        
        {/* Theme Selector */}
        <div className="w-full sm:w-auto flex-grow">
          <label htmlFor="theme-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Theme</label>
          <select
            id="theme-select"
            value={selectedTheme.value}
            onChange={handleThemeChange}
            disabled={isLoading}
            className="w-full px-3 py-2 text-base text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition disabled:opacity-50"
          >
            {themes.map((theme) => (
              <option key={theme.value} value={theme.value}>
                {theme.emoji} {theme.name}
              </option>
            ))}
          </select>
        </div>

        {/* Card Count Selector */}
        <div className="w-full sm:w-auto">
          <label htmlFor="card-count-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cards</label>
          <select
            id="card-count-select"
            value={numCards}
            onChange={handleNumCardsChange}
            disabled={isLoading || isComplexTheme}
            className="w-full px-3 py-2 text-base text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition disabled:opacity-50"
          >
            {cardCounts.map(count => (
              <option key={count} value={count}>{count}</option>
            ))}
          </select>
        </div>

        {/* Custom theme text input (visible when Custom is selected) */}
        {isCustomTheme && (
          <div className="w-full sm:w-auto">
            <label htmlFor="custom-theme-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Custom Theme</label>
            <input
              id="custom-theme-input"
              type="text"
              value={customThemeText ?? ''}
              onChange={(e) => onCustomThemeTextChange?.(e.target.value)}
              placeholder="Describe your custom theme"
              disabled={isLoading}
              className="w-full px-3 py-2 text-base text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition disabled:opacity-50"
            />
          </div>
        )}

        {/* Generate Button */}
        <div className="w-full sm:w-auto self-end">
         <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 sm:invisible">Action</label>
          <button
            onClick={onGenerate}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Get Scenarios'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};