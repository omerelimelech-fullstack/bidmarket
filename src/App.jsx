import React, { useState } from 'react';
import Wizard from './components/Wizard';
import MarketerFeed from './components/MarketerFeed';

function App() {
  const [view, setView] = useState('wizard'); // 'wizard' or 'feed'

  return (
    <div className="App font-sans">
      {/* Navigation Header */}
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                BidMarket
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setView('wizard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'wizard'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                Client Wizard
              </button>
              <button
                onClick={() => setView('feed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'feed'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                Marketer Feed
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {view === 'wizard' ? <Wizard /> : <MarketerFeed />}
      </main>
    </div>
  );
}

export default App;
