import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import WalletConnect from '../components/wallet/WalletConnect';
import SpaceView from '../components/space/SpaceView';

const SpacePage: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-primary-600">Dormlet</h1>
              </div>
              <div>
                <WalletConnect />
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your NFT Spaces</h2>
          <SpaceView />
        </main>
      </div>
    </Provider>
  );
};

export default SpacePage;
