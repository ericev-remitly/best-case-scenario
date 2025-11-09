
import React, { useState, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { CardGrid } from './components/CardGrid';
import { Loader } from './components/Loader';
import { generateScenarios } from './services/geminiService';
import type { ScenarioCard, Theme } from './types';
import { THEMES, CARD_COUNTS } from './constants';
import { ApiKeyModal } from './components/ApiKeyModal';

const App: React.FC = () => {
  const [cards, setCards] = useState<ScenarioCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(THEMES[0]);
  const [numCards, setNumCards] = useState<number>(CARD_COUNTS[0]);
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  const handleGenerate = useCallback(async () => {
    const apiKey = process.env.API_KEY || sessionStorage.getItem('gemini_api_key');

    if (!apiKey) {
      setIsApiKeyModalOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowIntro(false);

    const cardCountForApi = selectedTheme.value === 'complex_conundrums' ? 1 : numCards;

    try {
      const scenarios = await generateScenarios(selectedTheme.value, cardCountForApi, apiKey);
      setCards(scenarios);
    } catch (err) {
      console.error(err);
      setError('Oops! Something went wrong while generating scenarios. Please try again.');
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTheme, numCards]);

  const handleSaveApiKey = (apiKey: string) => {
    sessionStorage.setItem('gemini_api_key', apiKey);
    setIsApiKeyModalOpen(false);
    handleGenerate();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onSave={handleSaveApiKey}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-sky-500 to-indigo-600 text-transparent bg-clip-text">
            Best-Case Scenario
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A little game of positivity to brighten up your day. Perfect for team stand-ups!
          </p>
        </header>

        <ControlPanel
          themes={THEMES}
          cardCounts={CARD_COUNTS}
          selectedTheme={selectedTheme}
          onThemeChange={setSelectedTheme}
          numCards={numCards}
          onNumCardsChange={setNumCards}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />

        {isLoading && <Loader />}
        
        {error && (
          <div className="mt-8 text-center bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative animate-fade-in" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {showIntro && !isLoading && cards.length === 0 && (
          <div className="mt-12 text-center text-slate-500 dark:text-slate-400 animate-fade-in">
            <p className="text-xl">Select a theme and number of cards to start!</p>
          </div>
        )}

        {!isLoading && cards.length > 0 && <CardGrid cards={cards} />}
      </main>
      
      <footer className="text-center mt-12 text-sm text-slate-500 dark:text-slate-500">
        <p>Powered by React, Tailwind CSS, and the Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;
