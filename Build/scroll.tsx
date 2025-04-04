import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import WalletConnect from '../components/wallet/WalletConnect';
import ScrollCore from '../components/core/ScrollCore';
import SpaceView from '../components/space/SpaceView';

const ScrollPage: React.FC = () => {
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Scroll Through Your Spaces</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '600px' }}>
              <ScrollCore />
            </div>
            
            <div className="lg:col-span-2">
              <SpaceView />
            </div>
          </div>
        </main>
      </div>
    </Provider>
  );
};

export default ScrollPage;
